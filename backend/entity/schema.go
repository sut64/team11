package entity

import (
	"time"

	"gorm.io/gorm"
)

type Gender struct {
	gorm.Model
	Identity	string
	Patient	[]Patient	`gorm:"foreignKey:GenderID"`
}

type PatientType struct {
	gorm.Model
	Typename	string
	Patient	[]Patient	`gorm:"foreignKey:PatientTypeID"`
}

type Patient struct {
	
	gorm.Model
	HN			 string `gorm:"uniqueIndex"`
	Pid   		 string `gorm:"uniqueIndex"`
	FirstName 	 string
	LastName  	 string
	Birthdate 	 time.Time
	Age       	 uint
	DateAdmit 	 time.Time
	Symptom  	 string

	 //GenderID ทำหน้าที่เป็น ForeignKey
	GenderID 	*uint
	Gender   	Gender `gorm:"references:id"`

	//PatientTypeID ทำหน้าที่เป็น ForeignKey
	PatientTypeID 	*uint
	PatientType 	PatientType `gorm:"references:id"`

	//PatientRightID ทำหน้าที่เป็น ForeignKey
	PatientRightID 	*uint
	PatientRight 	PatientRight `gorm:"references:id"`
}
type PatientRight struct {

	gorm.Model

	Name 		string

	Discount	uint

	Patient		[]Patient	`gorm:"foreignKey:PatientRightID"`
	//Bills		[]Bill		`gorm:"foreignKey:PatientRightID"`
}

type PayType struct {

	gorm.Model

	Type 		string

	//Bills		[]Bill		`gorm:"foreignKey:PayTypeID"`
}
type Bill struct {

	gorm.Model

	//ExaminationID	*uint	

	//Examination		Examination		`gorm:"references:id"`

	PatientRightID	*uint

	PatientRight	PatientRight	`gorm:"references:id"`

	PayTypeID		*uint

	PayType			PayType			`gorm:"references:id"`

	BillTime	time.Time

	Total 			uint

	Note			string

	//CashierID		*uint

	//Cashier		Cashier	`gorm:"references:id"`

}