<?php

function invokeDefault($method, $function, $query) {
	if ($method === "GET") {
		if ($function[0] === "carousel") _default_carousel();
	}
}

function _default_carousel() {
	success(getDB()->select(TABLE_INDEX_CAROUSEL, ['picture', 'href', 'title'], ['disable' => '0'], 0, 'priority DESC'));
}