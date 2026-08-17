const loan = 8000000;
const r = 8.5 / 100 / 12;
for (let years = 5; years <= 30; years++) {
  const n = years * 12;
  const emi = loan * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const annualEmi = emi * 12;
  if (annualEmi > 400000 && annualEmi < 500000) {
    console.log(`Tenure ${years} years -> Annual EMI: ${annualEmi}`);
  }
}
