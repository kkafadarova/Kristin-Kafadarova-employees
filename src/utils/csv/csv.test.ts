import { rowsFromCSV } from "./csv";

function iso(d: Date) { return d.toISOString().slice(0,10); }

test("parses CSV with header and NULL DateTo", () => {
  const csv = `EmpID,ProjectID,DateFrom,DateTo
143,12,2013-11-01,2014-01-05
218,12,2013-12-20,NULL
`;
  const rows = rowsFromCSV(csv);
  expect(rows).toHaveLength(2);

  expect(rows[0].empId).toBe("143");
  expect(rows[0].projectId).toBe("12");
  expect(iso(rows[0].from)).toBe("2013-11-01");
  expect(iso(rows[0].to)).toBe("2014-01-05");

  // NULL → today
  expect(rows[1].empId).toBe("218");
  expect(iso(rows[1].from)).toBe("2013-12-20");
});
