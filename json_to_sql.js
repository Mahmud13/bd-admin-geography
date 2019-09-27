const fs = require("fs");
fs.readFile("bd_admin_geography.json", (err, data) => {
  if (err) {
    throw err;
  }
  const bd = JSON.parse(data);
  let sql =
    "SET NAMES utf8;\n" +
    "SET time_zone = '+00:00';\n" +
    "SET foreign_key_checks = 0;\n" +
    "SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';\n" +
    "SET NAMES utf8mb4;\n\n";
  sql += "DROP TABLE IF EXISTS `divisions`;\n";

  sql +=
    "CREATE TABLE `divisions` ( \n" +
    "  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  PRIMARY KEY (`id`)\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";

  sql += "INSERT INTO `divisions` (`id`, `name`, `name_en`) VALUES\n";
  for (let divisioni in bd.divisions) {
    const division = bd.divisions[divisioni];
    divisioni = parseInt(divisioni);
    sql +=
      "(" +
      (divisioni + 1) +
      ", '" +
      division.name +
      "', '" +
      division.name_en +
      "')";
    if (divisioni < bd.divisions.length - 1) {
      sql += ",\n";
    }
  }
  sql += ";\n\n";
  sql += "DROP TABLE IF EXISTS `districts`;\n";
  sql +=
    "CREATE TABLE `districts` ( \n" +
    "  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `division_id` int(10) unsigned NOT NULL,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  KEY `districts_division_id_foreign` (`division_id`),\n" +
    "  CONSTRAINT `districts_division_id_foreign` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE CASCADE\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";
  sql +=
    "INSERT INTO `districts` (`id`, `name`, `name_en`, `division_id`) VALUES\n";
  let districtId = 1;
  for (let divisioni in bd.divisions) {
    const division = bd.divisions[divisioni];
    divisioni = parseInt(divisioni);
    for (let districti in division.districts) {
      const district = division.districts[districti];
      districti = parseInt(districti);
      sql +=
        "(" +
        districtId++ +
        ", '" +
        district.name +
        "', '" +
        district.name_en +
        "', '" +
        (divisioni + 1) +
        "')";
      if (
        parseInt(divisioni) < bd.divisions.length - 1 ||
        parseInt(districti) < division.districts.length - 1
      ) {
        sql += ",\n";
      }
    }
  }
  sql += ";\n";
  sql += "DROP TABLE IF EXISTS `upazilas`;\n";
  sql +=
    "CREATE TABLE `upazilas` ( \n" +
    "  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `district_id` int(10) unsigned NOT NULL,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  KEY `upazilas_district_id_foreign` (`district_id`),\n" +
    "  CONSTRAINT `upazilas_district_id_foreign` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE CASCADE\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";
  sql +=
    "INSERT INTO `upazilas` (`id`, `name`, `name_en`, `district_id`) VALUES\n";
  districtId = 1;
  let upazilaId = 1;
  for (let divisioni in bd.divisions) {
    const division = bd.divisions[divisioni];
    divisioni = parseInt(divisioni);
    for (let districti in division.districts) {
      const district = division.districts[districti];
      for (let upazilai in district.upazilas) {
        const upazila = district.upazilas[upazilai];
        sql +=
          "(" +
          upazilaId++ +
          ", '" +
          upazila.name +
          "', '" +
          upazila.name_en +
          "', '" +
          districtId +
          "')";
        if (
          parseInt(divisioni) < bd.divisions.length - 1 ||
          parseInt(districti) < division.districts.length - 1 ||
          parseInt(upazilai) < district.upazilas.length - 1
        ) {
          sql += ",\n";
        }
      }
      districtId++;
    }
  }
  sql += ";\n\n";

  sql += "DROP TABLE IF EXISTS `unions`;\n";
  sql +=
    "CREATE TABLE `unions` ( \n" +
    "  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,\n" +
    "  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `name_en` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,\n" +
    "  `upazila_id` int(10) unsigned NOT NULL,\n" +
    "  PRIMARY KEY (`id`),\n" +
    "  KEY `unions_upazila_id_foreign` (`upazila_id`),\n" +
    "  CONSTRAINT `unions_upazila_id_foreign` FOREIGN KEY (`upazila_id`) REFERENCES `upazilas` (`id`) ON DELETE CASCADE\n" +
    ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n";
  sql +=
    "INSERT INTO `unions` (`id`, `name`, `name_en`, `upazila_id`) VALUES\n";
  upazilaId = 1;
  let unionId = 1;
  for (let divisioni in bd.divisions) {
    const division = bd.divisions[divisioni];
    for (let districti in division.districts) {
      let district = division.districts[districti];
      for (let upazilai in district.upazilas) {
        const upazila = district.upazilas[upazilai];
        for (let unioni in upazila.unions) {
          const union = upazila.unions[unioni];
          sql +=
            "(" +
            unionId++ +
            ", '" +
            union.name +
            "', '" +
            union.name_en +
            "', '" +
            upazilaId +
            "')";
          if (
            parseInt(divisioni) < bd.divisions.length - 1 ||
            parseInt(districti) < division.districts.length - 1 ||
            parseInt(upazilai) < district.upazilas.length - 1 ||
            parseInt(unioni) < upazila.unions.length - 1
          ) {
            sql += ",\n";
          }
        }
        upazilaId++;
      }
    }
  }
  sql += ";\n";

  fs.writeFile("bd_admin_geography.sql", sql, err => {
    console.log("ahhare");
  });
});
