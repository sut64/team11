package entity

import (
	//"time"

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