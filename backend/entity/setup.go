package entity

import (
	"gorm.io/gorm"

	"golang.org/x/crypto/bcrypt"
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
	database.AutoMigrate(&Employee{}, &Gender{}, &PatientType{}, &PatientRight{}, &Patient{}, &Clinic{}, &Appointment{})
	db = database

	//Role Data
	doctor := Role{
		Position: "Doctor",
	}
	db.Model(&Role{}).Create(&doctor)
	nurse := Role{
		Position: "Nurse",
	}
	db.Model(&Role{}).Create(&nurse)
	pharmacist := Role{
		Position: "Pharmacist",
	}
	db.Model(&Role{}).Create(&pharmacist)

	Pr1 := PatientRight{
		Name:     "สิทธิ์สุขภาพถ้วนหน้า",
		Discount: 80,
	}
	db.Model(&PatientRight{}).Create(&Pr1)

	Pr2 := PatientRight{
		Name:     "สิทธิ์นักศึกษา",
		Discount: 50,
	}
	db.Model(&PatientRight{}).Create(&Pr2)

	// Gender Data (ข้อมูลเพศ)
	male := Gender{
		Identity: "ชาย",
	}
	db.Model(&Gender{}).Create(&male)
	female := Gender{
		Identity: "หญิง",
	}
	db.Model(&Gender{}).Create(&female)

	// PatientType Data
	t1 := PatientType{
		Typename: "ปกติ",
	}
	db.Model(&PatientType{}).Create(&t1)
	t2 := PatientType{
		Typename: "อุบัติเหตุ",
	}
	db.Model(&PatientType{}).Create(&t2)
	t3 := PatientType{
		Typename: "คลอดบุตร",
	}
	db.Model(&PatientType{}).Create(&t3)
	t4 := PatientType{
		Typename: "แรกเกิด",
	}
	db.Model(&PatientType{}).Create(&t4)

	// Employee Data
	password, err := bcrypt.GenerateFromPassword([]byte("123456"), 14)
	db.Model(&Employee{}).Create(&Employee{
		Name:     "ภูวดล เดชารัมย์",
		Email:    "phu@email.com",
		Password: string(password),
		Role:     nurse,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "ชฎาพร ไทยคณา",
		Email:    "som@email.com",
		Password: string(password),
		Role:     nurse,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "แพทย์หญิงนรมน ไทยคณา",
		Email:    "nor@email.com",
		Password: string(password),
		Role:     doctor,
	})

	//--Clinic Data
	clinic01 := Clinic{
		ClinicName: "อายุรกรรม",
	}
	db.Model(&Clinic{}).Create(&clinic01)

	clinic02 := Clinic{
		ClinicName: "สูตินรีเวช",
	}
	db.Model(&Clinic{}).Create(&clinic02)

	clinic03 := Clinic{
		ClinicName: "กุมารเวชกรรม",
	}
	db.Model(&Clinic{}).Create(&clinic03)

	clinic04 := Clinic{
		ClinicName: "จักษุ",
	}
	db.Model(&Clinic{}).Create(&clinic04)

	clinic05 := Clinic{
		ClinicName: "วัณโรค",
	}
	db.Model(&Clinic{}).Create(&clinic05)

	clinic06 := Clinic{
		ClinicName: "จิตเวช",
	}
	db.Model(&Clinic{}).Create(&clinic06)

	clinic07 := Clinic{
		ClinicName: "กระดูกและข้อ",
	}
	db.Model(&Clinic{}).Create(&clinic07)

	clinic08 := Clinic{
		ClinicName: "ทันตกรรม",
	}
	db.Model(&Clinic{}).Create(&clinic08)

	clinic09 := Clinic{
		ClinicName: "โสต คอ นาสิก",
	}
	db.Model(&Clinic{}).Create(&clinic09)
}
