package entity

import (
	"fmt"
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)


func TestPatientPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	patient := Patient{
		HN:        "HN000001",
		Pid:       "1000000000001",
		FirstName: "ฟ้าใส",
		LastName:  "ใจดี",
		Birthdate: time.Date(2000, 1, 1, 0, 0, 0, 0, time.UTC),
		Age:       2,
		DateAdmit: time.Now(),
		Symptom:   "มีไข้มา3วัน",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(patient)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err ต้องเป็น nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}


// ตรวจสอบหมายเลข HN ต้องขึ้นต้นด้วย HN และตามด้วยตัวเลข 6 ตัว
func TestHNMustBeInValidPattern(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"HN000000000",
		"HN00000",
		"000000",
		"hn000000",
	}

	for _, fixture := range fixtures {
		patient := Patient{
			HN:        fixture, // ผิด
			Pid:       "2365498570763",
			FirstName: "ดำ",
			LastName:  "แดงดี",
			Birthdate: time.Date(2001, 1, 1, 0, 0, 0, 0, time.UTC),
			Age:       18,
			DateAdmit: time.Now(),
			Symptom:   "ปวดท้อง",
		}

		ok, err := govalidator.ValidateStruct(patient)

		// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error() ต้องมี message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`HN: %s does not validate as matches(^HN\d{6}$)`, fixture)))
	}
}
