package entity

import (
	"time"

	"github.com/asaskevich/govalidator"
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
	HN        string    `valid:"matches(^HN\\d{6}$),required~HN cannot be blank"`
	Pid       string    `valid:"matches(^[1-9]\\d{12}$),required~Identification Number cannot be blank"`
	FirstName string    `valid:"required~FirstName cannot be blank"`
	LastName  string    `valid:"required~LastName cannot be blank"`
	Birthdate time.Time `valid:"past~Birthdate must be in the past"`
	Age       uint      `valid:"range(0|120)"`
	DateAdmit time.Time
	Symptom   string

	//GenderID ทำหน้าที่เป็น ForeignKey
	GenderID *uint
	Gender   Gender `gorm:"references:id" valid:"-"`

	//PatientTypeID ทำหน้าที่เป็น ForeignKey
	PatientTypeID *uint
	PatientType   PatientType `gorm:"references:id" valid:"-"`

	//PatientRightID ทำหน้าที่เป็น ForeignKey
	PatientRightID *uint
	PatientRight   PatientRight `gorm:"references:id" valid:"-"`

	// 1 patient มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:PatientID"`

	// 1 Patient มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey:PatientID"`

	// 1 Patient มีได้หลาย PayMedicines
	PayMedicines []PayMedicine `gorm:"foreignKey: PatientID"`
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

	PatientRight PatientRight `gorm:"references:id" valid:"-"`

	PayTypeID *uint

	PayType PayType `gorm:"references:id" valid:"-"`

	BillTime time.Time `valid:"past~BillTime must be past"`

	Total uint `valid:"required~Total cannot be zero"`

	Telephone string `valid:"required~Telephone cannot be blank, matches(^[0]{1}[0-9]{9})"`

	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"`

	BillItems []BillItem `gorm:"foreignKey:BillID; constraint:OnDelete:CASCADE"`
}

type BillItem struct {
	gorm.Model

	BillID *uint
	Bill   Bill `gorm:"references:id" valid:"-"`

	ExaminationID *uint       `gorm:"uniqueIndex"`
	Examination   Examination `gorm:"references:id" valid:"-"`
}

type Appointment struct {
	gorm.Model

	AppointmentTime time.Time `valid:"future~AppointmentTime must be in the future"`
	Note            string    `valid:"required~Note cannot be blank"`
	RoomNumber      uint      `valid:"required~RoomNumber more than 0 and cannot be blank"`

	//PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient `gorm:"references:id" valid:"-"` // ไม่ validate ไปในระดับ relation

	//EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"` // ไม่ validate ไปในระดับ relation

	//ClinicID ทำหน้าที่เป็น FK
	ClinicID *uint
	Clinic   Clinic `gorm:"references:id" valid:"-"` // ไม่ validate ไปในระดับ relation
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

	// 1 Employee มีได้หลาย PayMedicine
	PayMedicines []PayMedicine `gorm:"foreignKey:EmployeeID"`

	// 1 Employee มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey:EmployeeID"`

	// 1 Employee มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:EmployeeID"`

	//1 Employee มีได้หลาย Bill
	Bills []Bill `gorm:"foreignKey:EmployeeID"`

	//1 Employee มีได้หลาย ClinicLog
	ClinicLogs []ClinicLog `gorm:"foreignKey:EmployeeID"`
}

type Clinic struct {
	gorm.Model
	ClinicName string

	// 1 Clinic มีได้หลาย ClinicLog
	ClinicLog []ClinicLog `gorm:"foreignKey:ClinicID"`

	// 1 Clinic มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey:ClinicID"`

	// 1 Clinic มีได้หลาย Appointment
	Appointments []Appointment `gorm:"foreignKey:ClinicID"`
}

type ClinicLog struct {
	gorm.Model
	SendingTime time.Time `valid:"DelayNow3Min~SendingTime must not be past."`
	Note        string    `valid:"required~Note must not be Blank."`
	ClinicRoom  uint      `valid:"range(1|9)"`

	//ClinicID ทำหน้าที่เป็น ForeignKey
	ClinicID *uint
	Clinic   Clinic `gorm:"references:id" valid:"-"`

	//PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient `gorm:"references:id" valid:"-"`

	//EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"`
}

type Examination struct {
	gorm.Model
	ChiefComplaint string
	Treatment      string    `valid:"required~Treatment Not Blank"`
	Cost           int       `valid:"positive~Cost cannot less than zero"`
	DiagnosisTime  time.Time `valid:"DelayNow3Min~DiagnosisTime must not be past"`

	// EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee `gorm:"references:id" valid:"-"`

	// PatientID ทำหน้าที่เป็น FK
	PatientID *uint
	Patient   Patient `gorm:"references:id" valid:"-"`

	// ClinicID ทำหน้าที่เป็น FK
	ClinicID *uint
	Clinic   Clinic `gorm:"references:id" valid:"-"`

	// DiseaseID ทำหน้าที่เป็น FK
	DiseaseID *uint
	Disease   Disease `gorm:"references:id" valid:"-"`

	// MedicineID ทำหน้าที่เป็น FK
	MedicineID *uint
	Medicine   Medicine `gorm:"references:id" valid:"-"`

	BillItems *BillItem `gorm:"foreignKey:ExaminationID"`
}

type Disease struct {
	gorm.Model
	Name string `gorm:"uniqueIndex"`

	// 1 Disease มีได้หลาย Examination
	Examinations []Examination `gorm:"foreignKey: DiseaseID"`
}

type PayMedicine struct {
	gorm.Model
	Pid             string
	Prescription    string
	PayMedicineTime time.Time

	// EmployeeID ทำหน้าที่เป็น FK
	EmployeeID *uint
	Employee   Employee `gorm:"references:id"`

	//PatientID ทำหน้าที่เป็น ForeignKey
	PatientID *uint
	Patient   Patient `gorm:"references:id"`

	//MedicineID ทำหน้าที่เป็น ForeignKey
	MedicineID *uint
	Medicine   Medicine `gorm:"references:id"`
}

type Medicine struct {
	gorm.Model
	Name string
	Cost uint

	// 1 Medicine มีได้หลาย PayMedicines
	PayMedicines []PayMedicine `gorm:"foreignKey: MedicineID"`

	// 1 Medicine มีได้หลาย Examinations
	Examinations []Examination `gorm:"foreignKey: MedicineID"`
}

func init() {
	govalidator.CustomTypeTagMap.Set("past", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Before(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("future", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("Now", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.Equal(time.Now())
	})

	govalidator.CustomTypeTagMap.Set("DelayNow3Min", func(i interface{}, context interface{}) bool {
		t := i.(time.Time)
		return t.After(time.Now().Add(3 - time.Minute))
	})

	govalidator.CustomTypeTagMap.Set("positive", func(i interface{}, context interface{}) bool {
		num := i
		return num.(int) >= 0
	})
}
