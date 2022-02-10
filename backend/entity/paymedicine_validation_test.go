package entity

import (
	"testing"
	"time"

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPayMedicineTimeMustBeNotPast(t *testing.T) {
	g := NewGomegaWithT(t)

	paymedicine := PayMedicine{
		PayMedicineTime: time.Date(2019, 1, 1, 12, 00, 00, 00, time.UTC),
		Prescription:    12345,
		Pid:             "1489900000001",
	}

	//ตรวจสอบ govalidator
	ok, err := govalidator.ValidateStruct(paymedicine)

	// ok ต้องไม่เป็น true แปลว่าต้องจับ error ได้
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องไม่เป็น nil แปลว่าต้องจับ error ได้
	g.Expect(err).ToNot(BeNil())

	// err.Error ต้องมี error message แสดงออกมา
	g.Expect(err.Error()).To(Equal("PayMedicineTime must be in the future"))

}
