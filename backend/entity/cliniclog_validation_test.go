package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestClinicLogPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	cliniclog := ClinicLog{
		SendingTime:	time.Date(2023,1,1,12,00,00,00,time.UTC),
		Note:			"-",	
		ClinicRoom:		9,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(cliniclog)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err ต้องเป็น nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

// ตรวจสอบหมายเหตุต้องไม่เป็นค่าว่าง
func TestNoteNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	cliniclog := ClinicLog{
		SendingTime:	time.Date(2023,1,1,12,00,00,00,time.UTC),
		Note:			"",	//ผิด
		ClinicRoom:		9,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(cliniclog)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Note must not be Blank."))
}

// ตรวจสอบเวลาการส่งตรวจต้องไม่เป็นเวลาในอดีต
func TestSendingTimeMustNotBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	cliniclog := ClinicLog{
		SendingTime:	time.Now().Add(5 - time.Hour), //ผิด
		Note:			"-",
		ClinicRoom:		9,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(cliniclog)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("SendingTime must not be past."))
}

// ตรวจสอบหมายเลขห้องตรวจต้องเป็นตัวเลข0-9
func TestClinicRoomMustBeInRange(t *testing.T) {
	g := NewGomegaWithT(t)

	cliniclog := ClinicLog{
		SendingTime:	time.Date(2023,1,1,12,00,00,00,time.UTC),
		Note:			"-",
		ClinicRoom:		10,		//ผิด
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(cliniclog)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("ClinicRoom: 10 does not validate as range(0|9)"))
}