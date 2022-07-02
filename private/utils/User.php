<?php

class User {
    public static $current_user = null;
    private bool $is_log = false;
    private bool $is_current_user = false;
    private int $id;
    private ?string $token;
    private DBAdapter $db_adapter;
    private string $username;
    private string $email;
    private $birthday;
    private int $status;
    private $join;
    private $last_sean;
    private ?string $verification_token = null;
    private int $permission = PERMISSION_DISCONNECT;

    /**
     * @param string|null $user id or username of the user: If null, get the current logged user
     */
    public function __construct(string $user = null) {

		$have_authorisation = false;
	    $token = null;
		$id = null;
	    $headers = apache_request_headers();
		$auth = $headers['authorization']??$headers['Authorization']??null;
	    if($auth !== null){
		    $matches = array();
		    preg_match('/(\d+) (.*)/', $auth, $matches);
		    if(isset($matches[1]) && isset($matches[2])){
			    $id = $matches[1];
			    $token = $matches[2];
				$have_authorisation = true;
		    }
	    }

	    $this->db_adapter = getDB();
        if ($user === null) {
            $this->is_current_user = true;
            User::$current_user = $this;
            if(!$have_authorisation) {
                return;
            }
            $this->fetch_data([
                "token"=>$token,
                "id"=>$id
            ]);
        } else {
            $this->fetch_data( is_numeric($user)? ["id"=>$user] : ["username" => $user]);
            if($this->is_log && $this->token !== null && $have_authorisation && $this->id === $id && $this->token === $token) {
                $this->is_current_user = true;
                if (User::$current_user === null) {
                    User::$current_user = $this;
                }
            }
        }
    }

	public function is_valid_password($password) : bool {
		$pass = $this->db_adapter->select(TABLE_USER, ['password'], ['id' => $this->id], 1);
		if (!$pass) return false;
		return password_verify($password, $pass["password"]);
	}

    private function fetch_data($where) {
        $raw = $this->db_adapter->select(TABLE_USER, ['id', 'token', 'username', 'email', 'birthday', 'status', 'date_inserted', 'date_updated', 'permission'], $where, 1);

        if ($raw) {
            $this->is_log = true;
            $this->id = $raw["id"];
            $this->token =$raw["token"]??null;
            $this->username = $raw["username"];
            $this->email = $raw["email"];
            $this->birthday = $raw["birthday"];
            $this->status = $raw["status"];
            $this->join = $raw["date_inserted"];
            $this->last_sean = $raw["date_updated"]??$this->join;
            $this->permission = $raw["permission"];
        } elseif (isset($where["token"])) {
			unauthorized(true);
        }
    }

    public function login($email, $password) : bool {

        $raw = $this->db_adapter->select(TABLE_USER, ['id', 'token', 'username', 'email', 'birthday', 'status', 'date_inserted', 'date_updated', 'permission', 'password'], [
            "email" => $email
        ], 1);

        if (!$raw) {
            return false;
        }

        $success = ((intval($raw['status']) & STATUS_DELETE) === 0) && password_verify($password, $raw["password"]);

        $log = [
            "user" => $raw['id'],
            'success' => $success ? '1' : '0'
        ];
        $addr = $_SERVER['REMOTE_ADDR'];
        $packedIp = @inet_pton($addr);
        if ($packedIp === false) {
            die('invalid ip');
        } else if (isset($packedIp[4])) {
            $log['ip_v6'] = $packedIp;
        } else {
            $log['ip_v4'] = $packedIp;
        }
        $this->db_adapter->insert(TABLE_CONNECTION, $log);

        if (!$success) {
            return false;
        }

        $this->id = $raw['id'];
        $this->token =$raw["token"]??null;
        $this->username = $raw["username"];
        $this->birthday = $raw["birthday"];
        $this->status = $raw["status"];
        $this->join = $raw["date_inserted"];
        $this->last_sean = $raw["date_updated"]??$this->join;
        $this->permission = $raw["permission"];
        $this->email = $email;

        if ($this->is_verified()) {
			if ($this->token === null)
			{
				$this->token = createMD5Token();
				$this->db_adapter->update(TABLE_USER, ["token" => $this->token], ["id" => $this->id]);
			}
        } else {
            $r = $this->db_adapter->select(TABLE_VERIFICATION, ["id"], ["user_id" => $this->id, 'type' => VERIFICATION_TYPE_EMAIL_CREATE], 1);
            if ($r) {
                $this->verification_token = $r["id"];
            } else {
                // create token and send email
                $this->verification_token = createMD5Token();
                $token_2 = createMD5Token();
                $this->db_adapter->insert(TABLE_VERIFICATION, ["id" => $this->verification_token, "user_id" => $this->id, 'type' => VERIFICATION_TYPE_EMAIL_CREATE, "token" => $token_2]);
                send_verification_mail($token_2, $this->id, $this->email, $this->username);
            }
        }
        return true;
    }

    public function is_connected(): bool {
        return $this->is_log;
    }

    public function is_current_connected(): bool {
        return $this->is_current_user;
    }

    /**
     * @return string
     */
    public function getUsername(): string {
        return $this->username;
    }

	/**
	 * @return string
	 */
	public function getEmail(): string {
		return $this->email;
	}


	/**
     * @return string
     */
    public function getId(): string {
        return $this->id;
    }

    public function getBirthday() {
        return $this->birthday;
    }

    public function getAge(): int {
        return floor((time() - strtotime($this->birthday)) / 60 / 60 / 24 / 365.25);
    }

    public function getAPIData($self=false): array {
        $data = [
            "id" => $this->id,
            "username" => $this->username,
            "age" => $this->getAge(),
            "join" => $this->join,
            "last_sean" => $this->last_sean,
        ];

        if ($self) {
            $data["email"] = $this->email;
            $data["birthday"] = $this->birthday;
            $data["permission"] = $this->permission;
        }

        return $data;
    }

    /**
     * @deprecated
     */
    public function getForumViewLevel(): int
    {
        return 0;
    }

    public function is_verified(): bool {
        return ($this->status & STATUS_EMAIL_VERIFIED) > 0;
    }

    public function get_verification_token() : ?string {
        return $this->verification_token;
    }

    public function get_permission_level() : int {
        return $this->permission & PERMISSION_MASK;
    }

    public function set_permission($permission): bool {
        if (!is_numeric($permission) || $permission < 1 || $permission > 255) {
            return false;
        }
        $this->permission = $permission;
        return getDB()->update(TABLE_USER, ["permission" => $permission], ["id" => $this->id]);
    }

	public function get_token(): string {
		return $this->token;
	}

    public function is_delete() : bool {
        return (intval($this->status) & STATUS_DELETE) > 0;
    }

    /**
     * @return mixed
     */
    public function getLastSean()
    {
        return $this->last_sean;
    }

    /**
     * @return mixed
     */
    public function getJoin()
    {
        return $this->join;
    }

}