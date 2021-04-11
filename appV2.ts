/*
    This is the app version 2, fixing the slowness problem.

    Well I do see the problem why this code is so slow - you are running it on O(n) complexity by using one "big" for loop
    to send for every employee of your organization the new calculated vacation days.
    The general Idea is to split the code to run in two or even three separate and independent async loops.
    This approach is reasonable since every employee is independent to one another so if I will run the code in more loops
     but asynchronously we will get the same result without changing the functionality/requirements 
     but we will make the code faster as you wish.
    The complexity will still be O(n) since we need to email the result to every employee in the company,
     but at least in the main idea we won't make it run on a one big for loop.

    I'm not sure if we are running this code on the backend or the frontend, 
    but if we run in it on the frontend side for example the website won't be blocked/freezed 
    until the whole operation will be finished, 
    and the same idea will be on the backend as well the server can still handling other responses and receiving requests as usual.
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

function calculateVacation(payrollInfo: Payroll, empInfo: Employee): Promise<any> {
    // "wrap" a sync function inside of a promise and finish the calulation.
    return new Promise((resolve) => {
        //let empInfo = employees.find(x => x.id == payrollInfo.emp_id);
        let today = new Date();
        let yearsEmployed = 0;

        if (empInfo != undefined) {
            yearsEmployed = yearsSince(empInfo.startDate, today);
        }
        let newVacationBalance = yearsEmployed + payrollInfo.vacationDays;
        // return all the relevant values from this promise as a single array to use.
        resolve([empInfo?.name, yearsEmployed, newVacationBalance]);
    });
}

async function asyncSendEmail(emailApi: EmailApi, payrollInfo: Payroll, addresses: AddressBook[], employees: Employee[]) {
    let addressInfo = addresses.find(x => x.emp_id == payrollInfo.emp_id);
    await Promise.all(employees.map(empInfo => {
        if (empInfo.id == payrollInfo.emp_id) {
            calculateVacation(payrollInfo, empInfo)
                .then(([empInfoName, yearsEmployed, newVacationBalance]) => {
                    if (addressInfo != undefined) {
                        emailApi.sendEmail(
                            addressInfo.email,
                            "Good news!",
                            `Dear ${empInfoName}\n` +
                            `based on your ${yearsEmployed} years of employment, you have been granted ${yearsEmployed} days of vacation, bringing your total to ${newVacationBalance}`
                        );
                    }
                });
        }
    }));
}

function grantVacation(
    emailApi: EmailApi,
    payroll: Payroll[],
    addresses: AddressBook[],
    employees: Employee[]) {
    // Moran's note: in general using for..in syntex is slow
    // by default since it causes a property lookups.
    // this is the main reason why for the same number of iterations,
    // the for...in loop is seven-time slower than the rest of the loops.

    for (let i = 0; i < payroll.length; i++) {
        let payrollInfo = payroll[i];
        asyncSendEmail(emailApi, payrollInfo, addresses, employees);
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