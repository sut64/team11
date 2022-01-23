package entity

import (
	"time"

	"gorm.io/gorm"
)

type Gender struct {
	gorm.Model
	Identity string
	Patient  []Patient `gorm:"foreignKey:GenderID"`
}

type PatientType struct {
	gorm.Model
	Typename string
	Patient  []Patient `gorm:"foreignKey:PatientTypeID"`
}

type Patient struct {
	gorm.Model
	HN        string `gorm:"uniqueIndex"`
	Pid       string `gorm:"uniqueIndex"`
	FirstName string
	LastName  string
	Birthdate time.Time
	Age       uint
	DateAdmit time.Time
	Symptom   string

	//GenderID ทำหน้าที่เป็น ForeignKey
	GenderID *uint
	Gender   Gender `gorm:"references:id"`

	//PatientTypeID ทำหน้าที่เป็น ForeignKey
	PatientTypeID *uint
	PatientType   PatientType `gorm:"references:id"`

	//PatientRightID ทำหน้าที่เป็น ForeignKey
	PatientRightID *uint
	PatientRight   PatientRight `gorm:"references:id"`

	// 1 patient มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:PatientID"`

	// 1 Patient มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey:PatientID"`
}
type PatientRight struct {
	gorm.Model

	Name string

	Discount uint

	Patient []Patient `gorm:"foreignKey:PatientRightID"`
	//Bills		[]Bill		`gorm:"foreignKey:PatientRightID"`
}

type PayType struct {
	gorm.Model

	Type string

	//Bills		[]Bill		`gorm:"foreignKey:PayTypeID"`
}
type Bill struct {

	gorm.Model

	PatientRightID *uint

	PatientRight PatientRight `gorm:"references:id"`

	PayTypeID *uint

	PayType PayType `gorm:"references:id"`

	BillTime time.Time

	Total uint

	Telephone string

	BillItemID 		*uint
	BillItem		BillItem `gorm:"references:id"`

	EmployeeID *uint
	Employee   Employee		`gorm:"references:id"`

}

type BillItem struct {

	gorm.Model

	ExaminationID			*uint
	Examination				Examination	`gorm:"references:id"`
	
}

type Appointment struct {
	gorm.Model

	AppointmentTime time.Time
	Note            string
	RoomNumber      uint

	//PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient

	//EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee

	//ClinicID ทำหน้าที่เป็น FK
	ClinicID *uint
	Clinic   Clinic
}

type Role struct {
	gorm.Model
	Position string
	Employee []Employee `gorm:"foreignKey:RoleID"`
}

type Employee struct {
	gorm.Model
	Name     string
	Email    string
	Password string

	//RoleID ทำหน้าที่เป็น ForeignKey
	RoleID *uint
	Role   Role `gorm:"references:id"`

	// 1 Employee มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey:EmployeeID"`

	// 1 Employee มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:EmployeeID"`

	//1 Employee มีได้หลาย Bill
	Bills 		[]Bill	`gorm:"foreignKey:EmployeeID"`

	//1 Employee มีได้หลาย ClinicLog
	ClinicLogs 		[]ClinicLog	`gorm:"foreignKey:EmployeeID"`
}

type Clinic struct {
	gorm.Model
	ClinicName string

	// 1 Clinic มีได้หลาย ClinicLog
	ClinicLog  []ClinicLog `gorm:"foreignKey:ClinicID"`

	// 1 Clinic มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey:ClinicID"`

	// 1 Clinic มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:ClinicID"`
}

type ClinicLog struct {
	gorm.Model
	SendingTime time.Time
	Note        string
	ClinicRoom  uint

	//ClinicID ทำหน้าที่เป็น ForeignKey
	ClinicID *uint
	Clinic   Clinic 		`gorm:"references:id"`

	//PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient		`gorm:"references:id"`

	//EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee		`gorm:"references:id"`
}

type Examination struct {
	gorm.Model
	ChiefComplaint string
	Treatment      string
	Cost           uint
	DiagnosisTime  time.Time

	// EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee `gorm:"references:id"`

	// PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient `gorm:"references:id"`

	// ClinicID ทำหน้าที่เป็น FK
	ClinicID *uint
	Clinic   Clinic `gorm:"references:id"`

	// DiseaseID ทำหน้าที่เป็น FK
	DiseaseID *uint
	Disease   Disease `gorm:"references:id"`

	// MedicineID ทำหน้าที่เป็น FK
	//MedicineID *uint
	//Medicine   Medicine `gorm:"references:id"`

	Examinations 		[]Examination  `gorm:"foreignKey:ExaminationID"`
}

type Disease struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	// 1 Disease มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey: DiseaseID"`
}
