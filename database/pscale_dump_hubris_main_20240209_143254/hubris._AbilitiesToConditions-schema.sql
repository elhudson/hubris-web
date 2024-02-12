CREATE TABLE `_AbilitiesToConditions` (
  `A` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  UNIQUE KEY `_AbilitiesToConditions_AB_unique` (`A`,`B`),
  KEY `_AbilitiesToConditions_B_index` (`B`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
