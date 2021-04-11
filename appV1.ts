/*
    This is the app version 1, without fixing the slowness problem.
    This is the code as I recievied it.
    Please pay attention to my fixing of the code since:
    1. the calling to the yearsSince function is wrong.
    2. not checking the objects that they won't be undefined is wrong (compilation errors as well).
 */

export interface AddressBook {
    emp_id: string | null;
    first: string;
    last: string;
    email: string;
}
export interface Payroll {
    emp_id: string;
    vacationDays: number;
}
interface Employee {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date | null;
}
export interface EmailApi {
    sendEmail(email: string, subject: string, body: string): void;
}
function yearsSince(startDate: Date, endDate: Date): number {
    const millisecondsPerYear = 365 * 24 * 60 * 60 * 1000;
    // Moran's note: added the trunc function in order to stay onle with the integer part of this calculation :)
    return Math.trunc((endDate.getTime() - startDate.getTime()) / millisecondsPerYear);
}
/**
 * We haved decided to grant bonus vacation to every employee, 1 day per year of experience
 * we need to email them a notice.
 */

function grantVacation(
    emailApi: EmailApi,
    payroll: Payroll[],
    addresses: AddressBook[],
    employees: Employee[],
) {
    for (var index in payroll) {
        let payrollInfo = payroll[index];
        let addressInfo = addresses.find(x => x.emp_id == payrollInfo.emp_id);
        let empInfo = employees.find(x => x.id == payrollInfo.emp_id);
        let today = new Date();
        let yearsEmployed = 0;
        // Moran's note: adding object checking due to compilation bugs without them:
        if (empInfo != undefined) {
            // Moran's note: fixed this line as well, it is not logical to put the endDate as the start date :)
            yearsEmployed = yearsSince(empInfo.startDate, today);
        }
        let newVacationBalance = yearsEmployed + payrollInfo.vacationDays;
        if (addressInfo != undefined && empInfo != undefined) {
            emailApi.sendEmail(
                addressInfo.email,
                "Good news!",
                `Dear ${empInfo.name}\n` +
                `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`
            );
        }
    }
}

// for the testing part I'll implement sendEmail as printing:
class myEmailApi implements EmailApi {
    sendEmail(email: string, subject: string, body: string): void {
        console.log('********************');
        console.log(`To ${email}, Subject: ${subject}, body: ${body}`);
        console.log('********************');
    }
}

let myPayroll: Payroll[] = [
    { emp_id: "1", vacationDays: 1 },
    { emp_id: "2", vacationDays: 2 },
    { emp_id: "3", vacationDays: 3 },
    { emp_id: "4", vacationDays: 4 },
    { emp_id: "5", vacationDays: 5 },
    { emp_id: "6", vacationDays: 6 }
];

let myAdress: AddressBook[] = [
    { emp_id: "1", first: "emp", last: "number 1", email: "emp1@gmail.com" },
    { emp_id: "2", first: "emp", last: "number 2", email: "emp2@gmail.com" },
    { emp_id: "3", first: "emp", last: "number 3", email: "emp3@gmail.com" },
    { emp_id: "4", first: "emp", last: "number 4", email: "emp4@gmail.com" },
    { emp_id: "5", first: "emp", last: "number 5", email: "emp5@gmail.com" },
    { emp_id: "6", first: "emp", last: "number 6", email: "emp6@gmail.com" },
];

let myEmployees: Employee[] = [
    { id: "1", name: "emp number 1", startDate: new Date("2020-01-01"), endDate: new Date("2025-01-01") },
    { id: "2", name: "emp number 2", startDate: new Date("2019-01-01"), endDate: new Date("2025-01-01") },
    { id: "3", name: "emp number 3", startDate: new Date("2018-01-01"), endDate: new Date("2025-01-01") },
    { id: "4", name: "emp number 4", startDate: new Date("2017-01-01"), endDate: new Date("2025-01-01") },
    { id: "5", name: "emp number 5", startDate: new Date("2016-01-01"), endDate: new Date("2025-01-01") },
    { id: "6", name: "emp number 6", startDate: new Date("2015-01-01"), endDate: new Date("2025-01-01") },
];

grantVacation(new myEmailApi(), myPayroll, myAdress, myEmployees);