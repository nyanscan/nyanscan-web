<?php

class Picture {
    public bool $isNew = false;
    private bool $isLoad = false;
    private ?string $id = null;
    private ?int $author = null;
    private ?string $title = null;
    private string $format = PICTURE_FORMAT_NONE;
    private $resource;

    static function delete($id) {
        $dir = substr($id,  0,5);
        if (file_exists(PICTURE_PATH . $dir)) {
            $ext = FORMAT_EXTENSION[$id[0]]??null;
            unlink(PICTURE_PATH . $dir . '/' . substr($id,  5) . '.' . $ext);
        }
    }

    public function __construct() {}

    public function __destruct() {
        if ($this->resource) {
            imagedestroy($this->resource);
        }
    }

    public function load($id, bool $load_resource = true) : bool {
        if ($this->isLoad) {
            return false;
        }
        $raw = getDB()->select(TABLE_PICTURE, ['id', 'author', 'title', 'format'], ["id" => $id], 1);
        if ($raw) {
            $this->isLoad = true;
            $this->id = $id;
            $this->author = $raw["author"]??null;
            $this->title =  $raw["title"]??null;
            $this->format =  substr($this->id, 0, 1);
            if ($load_resource) {
                try {
                    switch ( $this->format) {
                        case PICTURE_FORMAT_WEBP:
                            $this->resource = imagecreatefromwebp($this->get_full_path()); break;
                        case PICTURE_FORMAT_JPG:
                            $this->resource = imagecreatefromjpeg($this->get_full_path()); break;
                        case PICTURE_FORMAT_GIF:
                            $this->resource = imagecreatefromgif($this->get_full_path()); break;
                        case PICTURE_FORMAT_PNG:
                            $this->resource = imagecreatefrompng($this->get_full_path()); break;
                        default:
                            return false;
                    }
                } catch (Exception $e) {return false;}
            }
            return true;
        } else {
            return false;
        }
    }

    public function get_format(): ?string {
        return $this->format;
    }

    public function get_target_dir(): ?string {
        if ($this->id !== null && $this->format !== PICTURE_FORMAT_NONE) {
            return substr($this->id,  0,5);
        } else {
            return null;
        }
    }

    /**
     * @throws Exception
     */
    public function create_from_ressource($resource, string $format, ?int $author=null, ?string $title = null): bool {
        if ($this->isLoad) {
            return false;
        }
        $this->id = $format . uniqIdReal(23);
        $this->author = $author;
        $this->title =  $title;
        $this->format =  $format;
        $this->isNew = true;
        $this->resource = $resource;
        if (!$this->resource) {
            return false;
        }
        $this->isLoad = true;
        return true;
    }

    /**
     * @throws Exception
     */
    public function create(string $base_patch, string $format, bool $delete_origin = false, ?int $author=null, ?string $title = null) : bool {
        if ($this->isLoad) {
            return false;
        }
        $this->id = $format . uniqIdReal(23);
        $this->author = $author;
        $this->title =  $title;
        $this->format =  $format;
        $this->isNew = true;
        switch ($format) {
            case PICTURE_FORMAT_WEBP:
                $this->resource = imagecreatefromwebp($base_patch); break;
            case PICTURE_FORMAT_JPG:
                $this->resource = imagecreatefromjpeg($base_patch); break;
            case PICTURE_FORMAT_GIF:
                $this->resource = imagecreatefromgif($base_patch); break;
            case PICTURE_FORMAT_PNG:
                $this->resource = imagecreatefrompng($base_patch); break;
            default:
                break;
        }
        if ($delete_origin) {
            try {
                unlink($base_patch);
            } catch (Exception $e) {}
        }
        if (!$this->resource) {
            return false;
        }
        $this->isLoad = true;
        return true;
    }

    public function get_full_path() : ?string {
        $ext = FORMAT_EXTENSION[$this->format]??null;
        if ($this->id && $ext !== null) {
            return PICTURE_PATH . substr($this->id,  0,5) . '/' . substr($this->id,  5) . '.' . $ext;
        } else {
            return false;
        }
    }

    public function save(bool $bdd_only = false): bool {
        if (!$this->isLoad || $this->format === PICTURE_FORMAT_NONE || !$this->resource) {
            return false;
        }
        //var_dump($this);
        if (!$bdd_only) {
            $dir = substr($this->id,  0,5);

            if (!file_exists(PICTURE_PATH . $dir)) {
                mkdir(PICTURE_PATH . $dir, 0775);
            }

            switch ($this->format) {
                case PICTURE_FORMAT_WEBP:
                    imagewebp($this->resource, $this->get_full_path()); break;
                case PICTURE_FORMAT_JPG:
                    imagejpeg($this->resource, $this->get_full_path()); break;
                case PICTURE_FORMAT_GIF:
                    imagegif($this->resource, $this->get_full_path()); break;
                case PICTURE_FORMAT_PNG:
                    imagepng($this->resource, $this->get_full_path()); break;
                default:
                    return false;
            }
        }

        $data = [
            "id" => $this->id, "author" => $this->author,
            "title" => $this->title,
        ];

        if ($this->isNew) {
            getDB()->insert(TABLE_PICTURE, $data);
        } else {
            getDB()->update(TABLE_PICTURE, $data, ["id" => $this->id]);
        }
        return true;
    }

    public function resize(int $n_width, int $n_height): bool
    {
        if (!$this->id || !$this->resource) return false;
        $width = imagesx($this->resource);
        $height = imagesy($this->resource);
        //redimention de l'image source
//        if ($width >= $height) //visuel horizontal
//        {
//            $ratio = max($width / $n_width, $height / $n_height);
//            $new_width = $n_width;
//            $new_height = $height / $ratio;
//        } else //visuel vertical
//        {
//            $ratio = max($width / $n_width, $height / $n_height);
//            $new_width = $width / $ratio;
//            $new_height = $n_height;
//        }

        $thumb=imagecreatetruecolor($n_width,$n_height);
        imagecopyresampled($thumb,$this->resource, 0,0,0,0,$n_width,$n_height,$width,$height);
        imagedestroy($this->resource);
        $this->resource = $thumb;
        return true;
    }

    /**
     *
     * @param int $size Default size of the logo is 0
     */
    public function add_logo(int $size = 0): bool {
        if (!$this->id || !$this->resource) {
            return false;
        }

        $logo = imagecreatefrompng(LOGO_ALPHA_PATH);
        $width = imagesx($this->resource);
        $height = imagesy($this->resource);
        $logo_size = $size ?: floor(min($width / 8, $height / 8));
        $logo_width = imagesx($logo);
        $logo_height = imagesy($logo);

        $thumb=imagecreatetruecolor($logo_size,$logo_size);
        imagecopyresized($thumb,$logo,0,0,0,0,$logo_size,$logo_size,$logo_width,$logo_height);

        imagecopymerge($this->resource, $thumb, $width-$logo_size, $height-$logo_size, 0, 0, $logo_size, $logo_size, 60);

        imagedestroy($logo);
        imagedestroy($thumb);
        return true;
    }

    /*public function delete() {
        if ($this->isLoad) {
            return false;
        }
    }*/

    public function set_author(?int $id) {
        $this->author = $id;
    }

    public function set_title(?string $title) {
        $this->title = $title;
    }

    public function get_id(): ?string {
        return $this->id;
    }
}