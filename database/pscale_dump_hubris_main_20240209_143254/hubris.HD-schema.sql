CREATE TABLE `HD` (
  `id` int NOT NULL AUTO_INCREMENT,
  `charactersId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hit_diceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `max` int NOT NULL DEFAULT '1',
  `used` int NOT NULL DEFAULT '0',
  `src` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
