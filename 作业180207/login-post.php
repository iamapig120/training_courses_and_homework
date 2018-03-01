<?php
include_once 'SqlClient.php';
session_start();
$usr = $_POST["usr"];
$pass = $_POST["pass"];

try {
    $db = SqlClient::getConnect();
    $passWord = hash("sha512", $pass . "slimchat_R");
    $result;
    $sql;
    if (preg_match("/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i", $usr)) {
        $sql = 'SELECT * FROM users WHERE email=? AND pass=?';
    } elseif (strlen($usr) < 11) {
        $sql = 'SELECT * FROM users WHERE uid=? AND pass=?';
    } else {
        $sql = 'SELECT * FROM users WHERE phone=? AND pass=?';
    }
    $result = $db->query($sql, array($usr, $passWord));
    $loginSuccess = false;
    if ($result) {
        $loginSuccess = true;
    }
    $db->closeConnect();
    if ($loginSuccess) {
        echo '{"state":"success"}';
        //验证用户名和密码成功后
        $_SESSION['userinfo'] = [
            'usr' => hash("md5", $usr . $passWord)];
        //echo $_SESSION['userinfo']['usr'];
    } else {
        echo '{"state":"fail"}';
    }
} catch (PDOException $e) {
    //die ("Error!: " . $e->getMessage() . "<br/>");
}
?>
