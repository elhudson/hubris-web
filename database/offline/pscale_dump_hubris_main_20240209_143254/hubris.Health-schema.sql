CREATE TABLE `Health` (
  `notes` mediumtext COLLATE utf8mb4_unicode_ci,
  `injuriesId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `charactersId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hp` int NOT NULL,
  PRIMARY KEY (`charactersId`),
  UNIQUE KEY `Health_charactersId_key` (`charactersId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
