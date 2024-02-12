CREATE TABLE `_Damage_TypesToTag_Features` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_Damage_TypesToTag_Features_AB_unique` (`A`,`B`),
  KEY `_Damage_TypesToTag_Features_B_index` (`B`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
