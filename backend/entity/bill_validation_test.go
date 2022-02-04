package entity

import (
	"testing"
	"fmt"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestBillPass(t *testing.T) {
	g := NewGomegaWithT(t)

	// ข้อมูลถูกต้องหมดทุก field
	bill := Bill{
		BillTime : time.Date(2022, 1, 1, 12, 00, 00, 00, time.UTC),
		Total : 100,
		Telephone : "0123456789",

	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error
func TestUserTotalNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillTime : time.Date(2022, 1, 1, 12, 00, 00, 00, time.UTC),
		Total : 0,
		Telephone : "0123456789",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Total cannot be zero"))
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error
func TestBillTelephoneNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillTime : time.Date(2022, 1, 1, 12, 00, 00, 00, time.UTC),
		Total : 100,
		Telephone : "",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Telephone cannot be blank"))
}

// ตรวจสอบค่าว่างของชื่อแล้วต้องเจอ Error
func TestTelephoneMustBeValid(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		"1000000000", // 1 ตามด้วย 0-9 9 ตัว
		"200000000", // 0 ตามด้วย 0-9 8 ตัว
		"01234567", // 0 ตามด้วย 0-9 10 ตัว 
		"012345678", // 0 ตามด้วย 0-9 8 ตัว และ A
		"01234567A9", // A ตามด้วย 0-9 9 ตัว
		"A1234567A9",

	}

	for _, fixture := range fixtures {
		bill := Bill{
			BillTime : time.Date(2022, 1, 1, 12, 00, 00, 00, time.UTC),
			Total : 100,
			Telephone : fixture,
		}

		ok, err := govalidator.ValidateStruct(bill)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`Telephone: %s does not validate as matches(^[0]{1}[0-9]{9})`, fixture)))
	}
}

func TestBillTimeMustBePast(t *testing.T) {
	g := NewGomegaWithT(t)

	bill := Bill{
		BillTime:  time.Now().Add(24 * time.Hour), // อนาคต, fail
		Total: 100,
		Telephone : "0123456789",
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bill)

	// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("BillTime must be past"))
}