<?php

class User
{

    public static $current_user = null;

    private bool $is_log = false;
    private bool $is_current_user = false;
    private int $id;
    private string $token;
    private DBAdapter $db_adapter;
    private string $username;
    private string $email;
    private $birthday;
    private int $status;
    private $join;
    private $last_sean;

    /**
     * @param string|null $user id or username of the user if null get current log user
     */
    public function __construct(string $user = null)
    {
        $this->db_adapter = getDB();
        if ($user === null) {
            $this->is_current_user = true;
            User::$current_user = $this;
            if(empty($_SESSION["token"]) || empty($_SESSION["account-id"])) return;
            $this->fetch_data([
                "token"=>$_SESSION["token"],
                "id"=>$_SESSION["account-id"]
            ]);
        } else {
            $this->fetch_data( is_numeric($user)? ["id"=>$user] : ["username" => $user]);
            if(!(empty($_SESSION["token"]) || empty($_SESSION["account-id"])) &&
                $this->id == $_SESSION["account-id"] && $this->token === $_SESSION["token"]) {
                $this->is_current_user = true;
                if (User::$current_user === null) User::$current_user = $this;
            }
        }
    }

    private function fetch_data($where) {
        $raw = $this->db_adapter->select('USER', ['id', 'token', 'username', 'email', 'birthday', 'status', 'date_inserted', 'date_updated'], $where, 1);

        if ($raw) {
            $this->is_log = true;
            $this->id = $raw["id"];
            $this->token =$raw["token"];
            $this->username = $raw["username"];
            $this->email = $raw["email"];
            $this->birthday = $raw["birthday"];
            $this->status = $raw["status"];
            $this->join = $raw["date_inserted"];
            $this->last_sean = $raw["date_updated"];
        }
    }

    public function login($email, $password) : bool {

        $raw = $this->db_adapter->select('USER', ['id', 'username', 'birthday', 'status', 'password'], [
            "email" => $email
        ], 1);

        if (!$raw || !password_verify($password, $raw["password"])) return false;

        $this->id = $raw['id'];

        $this->token = createMD5Token();
        $this->db_adapter->update("USER", ["token" => $this->token], ["id" => $this->id]);

        $this->username = $raw["username"];
        $this->email = $email;
        $this->birthday = $raw["birthday"];
        $this->status = $raw["status"];

        $_SESSION["account-id"] = $this->id;
        $_SESSION["account-username"] = $this->username;
        $_SESSION["token"] = $this->token;
        return true;
    }

    public function is_connected(): bool
    {
        return $this->is_log;
    }

    public function is_current_connected(): bool
    {
        return $this->is_current_user;
    }

    /**
     * @return string
     */
    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * @return string
     */
    public function getId(): string
    {
        return $this->id;
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
        }

        return $data;
    }

    public function getForumViewLevel(): int
    {
        return $this->is_connected() ? FORUM_PERMISSION_VIEW_ADMIN : FORUM_PERMISSION_VIEW_EVERYONE;
    }

}