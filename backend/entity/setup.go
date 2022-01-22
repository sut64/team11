
package entity

import (
	"gorm.io/gorm"

	"gorm.io/driver/sqlite"
)

var db *gorm.DB

func DB() *gorm.DB {
	return db
}

func SetupDatabase() {
	database, err := gorm.Open(sqlite.Open("SE64.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema

	database.AutoMigrate()

	Pr1 := PatientRight{
		Name: "สิทธิ์สุขภาพถ้วนหน้า",
		Discount: 80,
	}
	db.Model(&PatientRight{}).Create(&Pr1)

	Pr2 := PatientRight{
		Name: "สิทธิ์นักศึกษา",
		Discount: 50,
	}
	db.Model(&PatientRight{}).Create(&Pr2)


	db = database
}