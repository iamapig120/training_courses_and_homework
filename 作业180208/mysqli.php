<?php 
/**
 * connect to database
 * @param  string $db       database name
 * @param  string $host     host name
 * @param  string $user     username
 * @param  string $password passwrod
 * @return an object represents the connection to a MySQL Server 
 * @author Zhangsan 123@163.com
 */
function connectDB($db,$host='localhost',$user='root',$password='root'){
	$link = mysqli_connect($host,$user,$password,$db);
	if (!$link) {
    	die('Connect Error (' . mysqli_connect_errno() . ') '
            . mysqli_connect_error());
	}
	mysqli_query($link,'SET NAMES UTF8');
	return $link;
}

/**
 * get records from some table
 * @param  object  $link     a link to mysql server
 * @param  string  $table    table name
 * @param  string  $fields   fields to get
 * @param  integer $where    query condition
 * @param  integer $multiple 1:get multiple records 2:get one record   otherwise:get the number of records in condition
 * @return mixed            array or null or integer
 */
function getRows($link,$table,$fields='*',$where=1,$multiple=1){
	$sql='SELECT '.$fields.' FROM '.$table.' WHERE '.$where;
	$res=mysqli_query($link,$sql) or die(mysqli_error($link));
	printf("%s\n", mysqli_info($link));
	$list=array();
	if($multiple==1){
		while($data=mysqli_fetch_assoc($res)){
			$list[]=$data;
		}
	}elseif($multiple==2){
		$list=mysqli_fetch_assoc($res);
	}else{
		$list=mysqli_num_rows($res);
	}
	return $list;
}
/**
 * add a record to database
 * @param object $link  
 * @param string $table 
 * @param array  $data  the data to add,e.g array('usernme'=>'Jim','phone'=>'13312345678')
 */
function addRow($link,$table,$data=array()){
	if(empty($data)||!is_array($data))return false;
	$sql='INSERT INTO '.$table.'(';
	$fields=implode(',',array_keys($data));
	$sql.=($fields.')VALUES(');
	$vals=array_values($data);
	$valsStr='';
	foreach($vals as $val){
		$valsStr.=("'".$val."',");
	}
	$valsStr=substr($valsStr,0,-1);
	$sql.=($valsStr.')');
	$res=mysqli_query($link,$sql) or die(mysqli_error($link));
	if($res){
		return mysqli_insert_id($link);
	}else{
		return false;
	}
}

/**
 * update some records via condition
 * @param  object $link  
 * @param  string $table
 * @param  strign $data  
 * @param  string $where 
 * @return integer number of records to update
 */
function update($link,$table,$data,$where){
	if(empty($data)||!is_array($data))return false;
	$sql='UPDATE '.$table.' SET ';
	$set='';
	foreach($data as $key=>$val){
		$set.=($key.'='."'".$val."',");
	}
	$set=substr($set,0,-1);
	$sql.=$set;
	$sql.= (' WHERE '.$where);
	$res=mysqli_query($link,$sql) or die(mysqli_error($link));
	return mysqli_affected_rows($link);
}

/**
 * delete some records from table via condition
 * @param  object  $link
 * @param  string  $table table name
 * @param  string  $where condition
 * @return integer        the number of records deleted
 */
function del($link,$table,$where=0){
	$sql='DELETE FROM '.$table.' WHERE '.$where;
	$res=mysqli_query($link,$sql) or die(mysqli_error($link));
	return mysqli_affected_rows($link);
}

?>