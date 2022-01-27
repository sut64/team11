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
	bl := Bill{
		Total : 100,
		Telephone : "0123456789",
		BillTime : time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bl)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).To(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).To(BeNil())
}

func TestBillTotalNotZero(t *testing.T) {
	g := NewGomegaWithT(t)

	
	bl := Bill{
		Total : 0, //ผิด
		Telephone : "0123456789",
		BillTime : time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bl)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Total cannot be zero"))
}

func TestBillTelephoneNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	
	bl := Bill{
		Total : 100, 
		Telephone : "",//ผิด
		BillTime : time.Now(),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bl)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("Telephone cannot be blank"))
}

func TestBillTelephoneMustBeValid(t *testing.T) {
	g := NewGomegaWithT(t)

	fixtures := []string{
		
		"1000000000", // 1 ตามด้วย 0-9 9 ตัว
		"A123456789", // A ตามด้วย 0-9 9 ตัว
		"012345678", // 0 ตามด้วย 0-9 8 ตัว
		"012345678A", // 0 ตามด้วย 0-9 8 ตัวและ A
		
	}

	
	for _, fixture := range fixtures {
		bl := Bill{
			Total : 100,
			Telephone : fixture,
			BillTime : time.Now(),
		}

		ok, err := govalidator.ValidateStruct(bl)

		// ok ต้องไม่เป็นค่า true แปลว่าต้องจับ error ได้
		g.Expect(ok).ToNot(BeTrue())

		// err ต้องไม่เป็นค่า nil แปลว่าต้องจับ error ได้
		g.Expect(err).ToNot(BeNil())

		// err.Error ต้องมี error message แสดงออกมา
		g.Expect(err.Error()).To(Equal(fmt.Sprintf(`Telephone: %s does not validate as matches(^[0]{1}[0-9]{9})`, fixture)))
	}
}

func TestBillBillTimeMustBeNow(t *testing.T) {
	g := NewGomegaWithT(t)

	
	bl := Bill{
		Total : 100, 
		Telephone : "0123456789",//ผิด
		BillTime : time.Date(2023,2,1,12,00,00,000,time.UTC),
	}
	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(bl)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err เป็นค่า nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("BillTime must be now"))
}