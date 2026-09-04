<?php
/**
 * Shared helper functions for Online Quiz Platform.
 */

/**
 * Escape HTML special characters for XSS prevention.
 *
 * @param string $str
 * @return string
 */
function e($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}
