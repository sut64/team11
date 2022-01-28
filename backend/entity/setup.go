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
	database.AutoMigrate(&Employee{}, &Gender{}, &PatientType{}, &PatientRight{}, &Patient{}, &Clinic{}, &Appointment{}, &ClinicLog{}, &Examination{}, &Disease{}, &Medicine{}, &PayType{}, &Bill{}, &BillItem{})
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
	cashier := Role{
		Position: "Cashier",
	}
	db.Model(&Role{}).Create(&cashier)

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
	db.Model(&Employee{}).Create(&Employee{
		Name:     "ภาคิน ศิลปเสริฐ",
		Email:    "au@email.com",
		Password: string(password),
		Role:     nurse,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "ฉัตรพัฒน์ รัชอินทร์",
		Email:    "force@email.com",
		Password: string(password),
		Role:     pharmacist,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "นายแพทย์ภูมิชัย ศิริพันธ์พรชนะ",
		Email:    "phum@email.com",
		Password: string(password),
		Role:     doctor,
	})
	db.Model(&Employee{}).Create(&Employee{
		Name:     "นายอนันต์ กระเซ็น",
		Email:    "pech@email.com",
		Password: string(password),
		Role:     cashier,
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

	// Disease Data
	di1 := Disease{
		Name: "-",
	}
	db.Model(&Disease{}).Create(&di1)
	di2 := Disease{
		Name: "เบาหวาน",
	}
	db.Model(&Disease{}).Create(&di2)
	di3 := Disease{
		Name: "ตับแข็ง",
	}
	db.Model(&Disease{}).Create(&di3)
	di4 := Disease{
		Name: "มะเร็ง",
	}
	db.Model(&Disease{}).Create(&di4)
	di5 := Disease{
		Name: "ไข้หวัดใหญ่",
	}
	db.Model(&Disease{}).Create(&di5)
	di6 := Disease{
		Name: "หัวใจ",
	}
	db.Model(&Disease{}).Create(&di6)
	di7 := Disease{
		Name: "ออฟฟิศซินโดรม",
	}
	db.Model(&Disease{}).Create(&di7)

	//Medicine Data
	medicine00 := Medicine{
		Name: "-",
		Cost: 0,
	}
	db.Model(&Medicine{}).Create(&medicine00)
	medicine01 := Medicine{
		Name: "พาราเซตามอล",
		Cost: 100,
	}
	db.Model(&Medicine{}).Create(&medicine01)

	medicine02 := Medicine{
		Name: "อะม็อกซีซิลลิน",
		Cost: 110,
	}
	db.Model(&Medicine{}).Create(&medicine02)

	medicine03 := Medicine{
		Name: "น้ํามันตับปลา",
		Cost: 90,
	}
	db.Model(&Medicine{}).Create(&medicine03)

	medicine04 := Medicine{
		Name: "วิตามิน C",
		Cost: 50,
	}
	db.Model(&Medicine{}).Create(&medicine04)

	medicine05 := Medicine{
		Name: "ยาฆ่าเชื้อ",
		Cost: 70,
	}
	db.Model(&Medicine{}).Create(&medicine05)

	medicine06 := Medicine{
		Name: "ยาแก้แพ้",
		Cost: 80,
	}
	db.Model(&Medicine{}).Create(&medicine06)

	//Paytype Data
	cash := PayType{
		Type: "เงินสด",
	}
	db.Model(&PayType{}).Create(&cash)
	debit := PayType{
		Type: "บัตรเครดิต",
	}
	db.Model(&PayType{}).Create(&debit)
}
