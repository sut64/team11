package entity

import (
	"time"

	"gorm.io/gorm"
)


type PatientRight struct {

	gorm.Model

	Name 		string

	Discount	uint

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