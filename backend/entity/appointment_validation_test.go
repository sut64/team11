package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestAppointmentPass(t *testing.T) {
	g := NewGomegaWithT(t)

	//ข้อมูลที่ถูกต้องหมดทุก field
	appointment := Appointment{
		AppointmentTime: time.Date(2023, 1, 1, 12, 00, 00, 00, time.UTC),
		Note:            "ฉีดวัคซีน",
		RoomNumber:      111,
	}

	//ตรวจสอบ govalidator
	ok, err := govalidator.ValidateStruct(appointment)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestAppointmentTime(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []time.Time{
		time.Now(), //ผิดเพราะเวลาต้องไม่เป็นอีตและปัจจุบัน
		time.Date(2019, 1, 1, 12, 00, 00, 00, time.UTC), //ผิดเพราะเวลาต้องไม่เป็นอีตและปัจจุบัน
	}

	for _, fixtures := range fixtures {
		appointment := Appointment{
			AppointmentTime: fixtures,
			Note:            "ฉีดวัคซีน",
			RoomNumber:      111,
		}

		//ตรวจสอบ govalidator
		ok, err := govalidator.ValidateStruct(appointment)

		// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal("AppointmentTime must be n the future"))

	}
}