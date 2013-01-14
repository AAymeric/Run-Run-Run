<?php

if ($db = sqlite_open('/Users/simon/Library/Application Support/Firefox/Profiles/z737xjdz.default/indexedDB/http+++localhost/2520219561t3ets.sqlite', 0666, $sqliteerror)) {
  echo "ok";
} else {
  die ($sqliteerror);
}



?>