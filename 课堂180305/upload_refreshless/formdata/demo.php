<?php
header("Contest-type:text/html,charset:utf-8");
if($_FILES['pic']['error']>0){
	exit("上传有误");
}
$name='./upload/';
$flie=$_FILES['pic']['name'];
//echo json_encode($_FILES);die;
$truename=$name.$flie;
//var_dump($_FILES);die;
if(move_uploaded_file($_FILES['pic']['tmp_name'],$truename)){
	echo "上传成功";
}else{
	echo "上传失败";
}