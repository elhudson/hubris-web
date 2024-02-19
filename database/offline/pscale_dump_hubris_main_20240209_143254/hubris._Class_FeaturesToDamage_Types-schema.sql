CREATE TABLE `_Class_FeaturesToDamage_Types` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_Class_FeaturesToDamage_Types_AB_unique` (`A`,`B`),
  KEY `_Class_FeaturesToDamage_Types_B_index` (`B`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
