<?php

const STATUS_NOTHING = 0;
const STATUS_EMAIL_VERIFIED = 1;
const STATUS_EMAIL_NEWS_LETTER = 1 << 1;
const STATUS_DELETE = 1 << 2;

const MESSAGE_STATUS_EDITED = 0b1;

/**
 * PERMISSION
 * size 1 byte
 *
 * MAX : 255 => admin
 * DEFAULT : 1 => connected
 * MIN : 0 => everyone
 *
 */
CONST PERMISSION_MASK = 0xFF;
const PERMISSION_ADMIN = 255;
const PERMISSION_MODERATOR = 200;
const PERMISSION_DEFAULT = 1;
const PERMISSION_DISCONNECT = 0;

const PERMISSION_CREATE_CATEGORY = PERMISSION_ADMIN;

const PROJECT_STATUS_WAIT_VERIFICATION = 0;
const PROJECT_STATUS_REJECT = 1;
const PROJECT_STATUS_ACCEPTED_NO_CONTENT = 2;
const PROJECT_STATUS_PUBLISHED = 3;

const EVENT_STATUS_WAIT_VERIFICATION = 0;
const EVENT_STATUS_REJECT = 1;
const EVENT_STATUS_ACCEPTED_NO_CONTENT = 2;
const EVENT_STATUS_PUBLISHED = 3;

const PICTURE_FORMAT_NONE = 'n';
const PICTURE_FORMAT_WEBP = 'w';
const PICTURE_FORMAT_PNG = 'p';
const PICTURE_FORMAT_JPG = 'j';
const PICTURE_FORMAT_GIF = 'g';

const FORMAT_EXTENSION = [
    PICTURE_FORMAT_NONE => null,
    PICTURE_FORMAT_WEBP => 'webp',
    PICTURE_FORMAT_PNG => 'png',
    PICTURE_FORMAT_JPG => 'jpg',
    PICTURE_FORMAT_GIF => 'gif',
];

const VERIFICATION_TYPE_EMAIL_CREATE = 0;
const VERIFICATION_TYPE_EMAIL_CHANGE = 1;
const VERIFICATION_TYPE_PASSWORD_CHANGE = 2;
const VERIFICATION_TYPE_DELETE = 3;
const VERIFICATION_TYPE_PASSWORD_FORGET = 4;

const AVATAR_SETTINGS = [
    "background" => ["display"=> "Fond", "count" => 9, "nullable" => false],
    "body" => ["display" => "Corp", "count" => 22, "nullable" => false],
    "head" => ["display" => "Tête", "count" => 21, "nullable" => false]
];