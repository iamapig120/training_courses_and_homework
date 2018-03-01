<?php
// by Handle https://www.bysb.net/ 2016.02.25
$usr = $_POST["usr"];
$passPost = $_POST["pass"];

$dbms = 'mysql';     //数据库类型
$host = 'localhost'; //数据库主机名
$dbName = 'slimchat';    //使用的数据库
$user = 'root';      //数据库连接用户名
$pass = 'Iamapig120';          //对应的密码

$dsn = "$dbms:host=$host;dbname=$dbName";

try {
    $dbh = new PDO($dsn, $user, $pass); //初始化一个PDO对象
    if (preg_match("/^([0-9A-Za-z\\-_\\.]+)@([0-9a-z]+\\.[a-z]{2,3}(\\.[a-z]{2})?)$/i", $usr)) {
        $stmt = $dbh->prepare('SELECT * FROM users WHERE email=?');
    } elseif (strlen($usr) < 11) {
        $stmt = $dbh->prepare('SELECT * FROM users WHERE uid=?');
    } else {
        $stmt = $dbh->prepare('SELECT * FROM users WHERE phone=?');
    }
    $stmt->bindParam(1, $usr);
    $stmt->execute();
    $loginSuccess = false;
    $passWord = hash("sha512", $passPost . "slimchat_R");
    foreach ($stmt->fetchAll() as $row) {
        if ($row["pass"] == $passWord) {
            $loginSuccess = true;
            break;
        }
    }
    $dbh = null;
    if ($loginSuccess) {
        echo '{"state":"success"}';
        //验证用户名和密码成功后
        $_SESSION['userinfo'] = [
            'usr' => hash("md5", $usr . $passWord)];
    } else {
        echo '{"state":"fail"}';
    }
} catch (PDOException $e) {
    //die ("Error!: " . $e->getMessage() . "<br/>");
}
?>
