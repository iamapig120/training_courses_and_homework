<?php 
session_start();
//若cookie存在，清除cookie
if(!empty($_COOKIE['userInfo'])){
	setcookie('userInfo','',time()-1);
}
//若session存在，清除session
if(!empty($_SESSION['username'])){
	unset($_SESSION['username']);
}
//跳转
header('Location:login.php');

?>