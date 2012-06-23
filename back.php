<?php
require_once('db.php');

function getinv() {
  $crap = array();
  $cats = array();
  $q = mysql_query("SELECT *, orig_stock - COALESCE((SELECT SUM(quantity) FROM orders WHERE orders.item = items.id),0) AS stock FROM cats JOIN items USING (cat_id) HAVING stock > 0") or die(mysql_error());
  while ($r = mysql_fetch_assoc($q)) {
    $id = $r['id'];
    unset($r['id']);
    $crap[$id] = $r;
  }
  foreach ($crap as $id=>$item) {
  $cats[$item['cat_id']] = $item['category'];
  }
  return array($cats,$crap);
}


if (!isset($_GET['cmd'])) { die ('nope.avi'); }


switch ($_GET['cmd']) {
  case 'inv':
    print json_encode(getinv());
    break;
  case 'submit':
    if ( !isset($_SERVER["REMOTE_USER"]) ) {die('NOPE.avi');}
    $order = array();
   	foreach ($_POST['order'] as $id=>$cnt) {
      if (is_numeric($id) != TRUE) { die('bad data!');}
      if ($cnt > 0) {
  	    $q = "INSERT INTO orders (`user`,`item`,`quantity`,`price`) VALUES ('".mysql_real_escape_string($_SERVER['REMOTE_USER'])."',".mysql_real_escape_string($id).",".mysql_real_escape_string($cnt).",".mysql_real_escape_string($_POST['inv'][$id]['price']).")";
        mysql_query($q) or die(mysql_error());
	    }
	}
    break;
}
