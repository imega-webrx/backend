CREATE DATABASE /*!32312 IF NOT EXISTS*/ `stock` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `stock`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `entities` (
  `id` binary(16) NOT NULL COMMENT 'UUID entity',
  `type` varchar(255) NOT NULL COMMENT 'type entity',
  `entity` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'entity' CHECK (json_valid(`entity`)),
  `created` datetime NOT NULL DEFAULT current_timestamp() COMMENT 'date create at',
  `updated` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'date update at',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'is deleted',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='entities';
/*!40101 SET character_set_client = @saved_cs_client */;

CREATE TABLE `triples` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `subject` binary(16) NOT NULL COMMENT 'UUID subject',
  `predicate` varchar(255) NOT NULL COMMENT 'relation between subject and object',
  `object` binary(16) NOT NULL COMMENT 'UUID object',
  `priority` int(11) NOT NULL DEFAULT 1 COMMENT 'order',
  `deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'is deleted',
  PRIMARY KEY (`id`),
  KEY `subject` (`subject`,`predicate`,`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='triples';

CREATE TABLE suggestion_products (
    `id` binary(16) NOT NULL COMMENT 'UUID product',
    `source` varchar(1024) NOT NULL COMMENT 'search source',
    `type` varchar(255) NOT NULL COMMENT 'entity type',
    PRIMARY KEY (`id`),
    FULLTEXT `text` (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='suggestion products';

SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `entities` (id,`type`,entity) VALUES
(X'435B8B4EED4BF8F583CC27FEADA6136A','ru.webrx.folder','{\"id\":\"ed4bf8f5-8b4e-435b-83cc-27feada6136a\",\"title\":\"root folder\",\"description\":\"\",\"type\":\"ru.webrx.folder\"}');
