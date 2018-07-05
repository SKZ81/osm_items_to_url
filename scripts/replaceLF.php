<?php
  function replaceLF($str) {
    $order   = array("\r\n", "\n\r", "\n", "\r");
    $replace = '<br>';

    // Processes \r\n's first so they aren't converted twice.
    return str_replace($order, $replace, $str);
  }
?>