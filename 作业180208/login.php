<?php 
header("Content-type:text/html;charset=utf-8");
if(!empty($_POST)){
	$username= $_POST['username'];
	//$username= addslashes($_POST['username']);
	$password= md5($_POST['password']);
	//include('mysql.php');
	// //连接
	//$link=connectDB('0126');
	// // 查询
	//$where=' BINARY username="'.$username.'" AND BINARY password="'.$password.'"';
	//echo $where;
	// $where=array('username'=>$username,'password'=>$password);
	// $userInfo=getRowsI($link,'admin','*',$where,2);
	//$userInfo=getRows($link,'admin','*',$where,2);
	//stmt预处理
	// $mysqli = new mysqli("localhost", "root", "root", "0126");
	// $stmt = $mysqli->prepare("SELECT * FROM admin WHERE username = ? AND password= ?");
	// $stmt->bind_param('ss', $username,$password);
	// $stmt->execute();
	// $res = $stmt->get_result();
	// $userInfo = $res->fetch_assoc();
	// pdo
	$pdo = new PDO("mysql:host=localhost;dbname=0126;charset=utf8",'root','root');
$pdo->exec('set names utf8');
$sql = "select * from admin where username = ?  AND password=?";
$sth = $pdo->prepare($sql);
$sth->bindParam(1, $username);
$sth->bindParam(2, $password);
$sth->execute();
$userInfo=$sth->fetch(PDO::FETCH_ASSOC);


	var_dump($userInfo);die;
	if(!empty($userInfo)){
		session_start();
		$_SESSION['username']=$username;
		header('Location:index.php');
	}else{
		echo '<script>alert("用户名或密码错误!")</script>';
	}
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	<form action="" method="post">
		<input type="text" placeholder='用户名' name='username'>
		<input type="password" placeholder='密码' name='password'>
		<input type="submit">
	</form>
</body>
</html>