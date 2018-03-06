# Host: localhost  (Version: 5.5.40-log)
# Date: 2018-03-02 11:30:13
# Generator: MySQL-Front 5.3  (Build 4.120)

/*!40101 SET NAMES utf8 */;

#
# Structure for table "auth"
#

DROP TABLE IF EXISTS `auth`;
CREATE TABLE `auth` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

#
# Data for table "auth"
#

/*!40000 ALTER TABLE `auth` DISABLE KEYS */;
INSERT INTO `auth` VALUES (3,'releaser','1,2,3'),(5,'editor','1,2,3,4,5,6,7,8,10'),(6,'Super Admin','1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20');
/*!40000 ALTER TABLE `auth` ENABLE KEYS */;

#
# Structure for table "category"
#

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `pid` int(11) DEFAULT NULL,
  `create_time` int(11) DEFAULT NULL,
  `create_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

#
# Data for table "category"
#

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'科技',0,NULL,NULL),(2,'财经',0,NULL,NULL),(3,'社会',0,NULL,NULL),(4,'政治',0,NULL,NULL),(5,'外交',0,NULL,NULL),(6,'军事',0,NULL,NULL),(7,'教育',0,NULL,NULL),(8,'体育',0,NULL,NULL),(9,'理化',1,NULL,NULL),(10,'计算机',1,NULL,NULL),(11,'人工智能',10,NULL,NULL),(12,'产业',2,NULL,NULL),(13,'金融',2,NULL,NULL),(14,'股市',13,NULL,NULL),(15,'家庭',3,NULL,NULL),(16,'量子物理',9,1508501754,2),(17,'核能应用',20,1508502633,2),(18,'天体物理',9,1508502693,2),(19,'核反应堆',NULL,1508979025,2),(20,'有机化学',9,1508979112,2);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

#
# Structure for table "news"
#

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `cid` int(11) DEFAULT NULL COMMENT '类别id',
  `author` varchar(50) DEFAULT NULL,
  `content` text,
  `create_time` int(11) DEFAULT NULL,
  `create_by` int(11) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=MyISAM AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

#
# Data for table "news"
#

/*!40000 ALTER TABLE `news` DISABLE KEYS */;
INSERT INTO `news` VALUES (1,'祸不单行！朴槿惠本周内或被自由韩国党开除党籍',NULL,'白岩松111','&lt;div class=&quot;img-container&quot; style=&quot;margin-top: 30px; font-family: arial; font-size: 12px; background-color: rgb(255, 255, 255);&quot;&gt;&lt;img class=&quot;large&quot; src=&quot;https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=2428812441,3267139550&amp;amp;fm=173&amp;amp;s=AB8EB0457412E67D5C0C79910300F088&amp;amp;w=550&amp;amp;h=595&amp;amp;img.JPEG&quot; style=&quot;border: 0px; width: 536.997px;&quot;&gt;&lt;/div&gt;&lt;p style=&quot;margin: 26px 0px 0px; padding: 0px; font-size: 16px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; background-color: rgb(255, 255, 255);&quot;&gt;朴槿惠&lt;/p&gt;&lt;p style=&quot;margin: 22px 0px 0px; padding: 0px; font-size: 16px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; background-color: rgb(255, 255, 255);&quot;&gt;海外网10月16日电，上周五（13日），韩国法院再次签发对朴槿惠的拘捕令，这位65岁的韩国前总统即将面对最长可达半年的牢狱生活。但祸不单行，朴槿惠刚刚送走她的“黑色星期五”，又迎来更加扎心的一周。据韩媒报道，朴槿惠所属政党自由韩国党最早将于明天（17日）召开会议，届时很可能作出开除其党籍的处分。&lt;/p&gt;&lt;p style=&quot;margin: 22px 0px 0px; padding: 0px; font-size: 16px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; background-color: rgb(255, 255, 255);&quot;&gt;韩国《亚洲经济》等韩媒15日援引政界人士消息称，自由韩国党将于17日或18日召开伦理委员会，对朴槿惠及其他两位亲朴议员的处分作出决定。&lt;/p&gt;&lt;p style=&quot;margin: 22px 0px 0px; padding: 0px; font-size: 16px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; background-color: rgb(255, 255, 255);&quot;&gt;朴槿惠将接受何种处分？报道分析称，很可能会按照此前自由韩国党革新委员会公布的方案，规劝朴槿惠“自行退党”。按规定，受到此种处分的人在接到通知10天以内不提交退党申报的话，将会立即被除名。&lt;/p&gt;&lt;p style=&quot;margin: 22px 0px 0px; padding: 0px; font-size: 16px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; background-color: rgb(255, 255, 255);&quot;&gt;据海外网早前报道，自由韩国党党代表洪准杓一直在党内策划并实施一系列清算，以排除朴槿惠造成的影响及积弊。韩国《国际新闻》称，洪准杓将党派支持率徘徊不前的原因，归咎于朴槿惠的党籍问题，对此他多次提议“开除朴槿惠党籍”。当然，党派内也不乏反对之声。在亲朴人士看来，目前朴槿惠的罪名尚未成立，着急将她“逐出门户”，只会导致党派人心涣散。&lt;/p&gt;&lt;p style=&quot;margin: 22px 0px 0px; padding: 0px; font-size: 16px; line-height: 24px; color: rgb(51, 51, 51); text-align: justify; font-family: arial; background-color: rgb(255, 255, 255);&quot;&gt;8月29日，一位亲朴人士向韩国《国民日报》透露，“朴槿惠前总统绝不考虑自愿退党。”“朴槿惠表示，如果自由韩国党想跟她一刀两断，那就直接开除她党籍。”&lt;/p&gt;',1508142545,2,NULL),(5,'title001title001title001title001title001',NULL,'title001','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001&lt;/span&gt;&lt;/font&gt;',1508142657,2,NULL),(6,'title001title001title001title001title001',NULL,'title001','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001title001&lt;/span&gt;&lt;/font&gt;',1508142662,2,NULL),(7,'title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142694,2,NULL),(8,'title002',NULL,'title002','',1508142699,2,NULL),(9,'title002title002title002title002title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142728,2,NULL),(10,'title002title002title002title002title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142733,2,NULL),(11,'title002title002title002title002title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142737,2,NULL),(12,'title002title002title002title002title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142741,2,NULL),(13,'title002title002title002title002title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142746,2,NULL),(14,'title002title002title002title002title002',NULL,'title002','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002title002&lt;/span&gt;&lt;/font&gt;',1508142750,2,NULL),(15,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142800,2,NULL),(16,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142805,2,NULL),(17,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142809,2,NULL),(18,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142813,2,NULL),(19,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142818,2,NULL),(20,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142823,2,NULL),(21,'title003title003title003title003',NULL,'title003','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003title003&lt;/span&gt;&lt;/font&gt;',1508142828,2,NULL),(22,'test1023test1023test1023',NULL,'test1023','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;test1023test1023test1023test1023test1023test1023&lt;/span&gt;&lt;/font&gt;',1508746251,2,'59eda40ad21f4.jpg'),(23,'test1023_2test1023_2',NULL,'test1023_2','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;test1023_2test1023_2test1023_2&lt;/span&gt;&lt;/font&gt;',1508748519,2,'59edace623b12.jpg'),(24,'test1023_3test1023_3',NULL,'test1023_3','&lt;font face=&quot;Arial, Helvetica, sans-serif&quot;&gt;&lt;span style=&quot;font-size: 13px;&quot;&gt;test1023_3test1023_3test1023_3test1023_3&lt;/span&gt;&lt;/font&gt;',1508748810,2,'59edae099e28c.jpg'),(25,'dxjdjdjdjdj',NULL,'didididi','dkdkddkdk',1508804958,2,'59ee8944b6cae.jpg'),(26,'test1025_1test1025_1',2,'test1025_1','',1508937493,2,NULL),(27,'test1025_1test1025_1',2,'test1025_1','',1508937568,2,NULL),(28,'test1025_2test1025_2test1025_2',2,'test1025_2','',1508937604,2,NULL),(29,'test1025_2test1025_2test1025_2',2,'test1025_2','',1508937714,2,NULL),(30,'test1025_2test1025_2test1025_2',2,'test1025_2','',1508937744,2,NULL),(31,'',1,'','',1508937805,2,NULL),(32,'',1,'','',1508937812,2,NULL),(33,'',4,'','',1508937849,2,NULL),(34,'',4,'','',1508938540,2,NULL),(35,'sssssssssss',15,'ssssss','',1508940308,2,NULL);
/*!40000 ALTER TABLE `news` ENABLE KEYS */;

#
# Structure for table "user"
#

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `email` varchar(30) NOT NULL,
  `auth_item` varchar(255) DEFAULT NULL,
  `last_login_time` int(11) DEFAULT NULL,
  `last_login_ip` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

#
# Data for table "user"
#

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2,'lisi','96e79218965eb72c92a549dd5a330112','lisi@163.com','6',1519917134,'127.0.0.1'),(3,'wangwu','96e79218965eb72c92a549dd5a330112','wangwu_update@qq.com','3',1509445740,'127.0.0.1'),(4,'zhaoliu','96e79218965eb72c92a549dd5a330112','lisi@163.com',NULL,NULL,NULL),(5,'zhangqi','e3ceb5881a0a1fdaad01296d7554868d','wangwu_update@qq.com',NULL,NULL,NULL),(6,'wangwu','e3ceb5881a0a1fdaad01296d7554868d','wangwu_update@qq.com',NULL,NULL,NULL),(7,'chenba','e3ceb5881a0a1fdaad01296d7554868d','wangwu_update@qq.com',NULL,NULL,NULL),(8,'zhaojiu','e3ceb5881a0a1fdaad01296d7554868d','wangwu_update@qq.com',NULL,NULL,NULL),(9,'qianshi','e3ceb5881a0a1fdaad01296d7554868d','wangwu_update@qq.com',NULL,NULL,NULL),(10,'zhoushiyi','e3ceb5881a0a1fdaad01296d7554868d','wangwu_update@qq.com',NULL,NULL,NULL),(11,'qianba1011','e3ceb5881a0a1fdaad01296d7554868d','qian1011@qq.com',NULL,NULL,NULL),(12,'qianba1011','e3ceb5881a0a1fdaad01296d7554868d','qian1011@qq.com',NULL,NULL,NULL),(13,'qianba1011','111111','qian1011@qq.com',NULL,NULL,NULL),(14,'qianba1011','111111','qian1011@qq.com',NULL,NULL,NULL),(15,'qianba1011','111111','qian1011@qq.com',NULL,NULL,NULL),(16,'qianba1011','111111','qian1011@qq.com',NULL,NULL,NULL),(18,'test1010','111111','test@123.com',NULL,NULL,NULL),(19,'test1010','111111','test@123.com',NULL,NULL,NULL),(20,'test1010','111111','test@123.com',NULL,NULL,NULL),(21,'test1010','111111','test@123.com',NULL,NULL,NULL),(22,'test1010','111111','test@123.com',NULL,NULL,NULL),(23,'admin','96e79218965eb72c92a549dd5a330112','admin@163.com','5',1509494655,'127.0.0.1');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
