<?php
require_once __DIR__ . '/../../includes/response.php';
require_once __DIR__ . '/../../services/ResultService.php';

validateRequestMethod('GET');

$res = ResultService::getLeaderboard();
sendSuccess($res['data']);
