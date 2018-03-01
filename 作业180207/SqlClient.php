<?php
/**
 * User: Handle
 * Date: 2018/2/7
 * Time: 22:46
 */

class SqlClient
{
    private $dbms = 'mysql';     //数据库类型
    private $host = 'localhost'; //数据库主机名
    private $dbName = 'slimchat';    //使用的数据库
    private static $user = 'root';      //数据库连接用户名
    private static $pass = 'Iamapig120';          //对应的密码

    private static $dsn;

    private static $dbcon = false;    //连接数据库状态
    private static $self = false;

    private function __construct()
    {
        self::$dsn = "$this->dbms:host=$this->host;dbname=$this->dbName";
        self::$dbcon = new PDO(self::$dsn, self::$user, self::$pass); //初始化一个PDO对象
    }

    /**
     * @return SqlClient
     */
    public static function getConnect()
    {
        try {
            if (!self::$self) {
                self::$self = new self;
            }
            if (!self::$dbcon) {
                self::$dbcon = new PDO(self::$dsn, self::$user, self::$pass); //初始化一个PDO对象
            }
            return self::$self;
        } catch (PDOException $e) {
            die ("Error!: " . $e->getMessage() . "<br/>");
        }
    }

    public static function closeConnect()
    {
        self::$dbcon = null;
    }

    public static function query($sql, $values = array())
    {
        try {
            if (!self::$dbcon) {
                return fasle;
            }
            $stmt = self::$dbcon->prepare($sql);
            $stmt->execute($values);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            die ("Error!: " . $e->getMessage() . "<br/>");
        }
    }
}

