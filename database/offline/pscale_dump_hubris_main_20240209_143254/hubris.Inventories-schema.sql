CREATE TABLE `Inventories` (
  `charactersId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`charactersId`),
  UNIQUE KEY `Inventories_charactersId_key` (`charactersId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
