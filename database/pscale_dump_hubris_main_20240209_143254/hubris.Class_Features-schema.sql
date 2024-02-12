CREATE TABLE `Class_Features` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `xp` int NOT NULL,
  `ticks` int DEFAULT NULL,
  `class_PathsId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classesId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tier` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Class_Features_id_key` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
