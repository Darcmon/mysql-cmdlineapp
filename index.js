require('dotenv').config()
const inquirer = require("inquirer");
const db = require("./db/connection.js");

const init = () => {


    console.log("---------------EMPLOYEE TRACKER-------------------")


    return inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role", "End Program"]


        }
    ]).then(res => {
        switch (res.action) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployee();
                break;
            case "Update employee managers":
                updateManager();
                break;
            case "End Program" : 
              db.end();
              break;

        }
    })
}

// view all Departments
const viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });

};
// view role assigned 
const viewAllRoles = () => {
    const query = `
        SELECT
            role.id AS id,
            role.title AS 'Job Title',
            role.salary AS 'Employee Salary',
            department.name AS Department
        FROM
            role
            INNER JOIN department ON role.department_id = department.id;
        `;

    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        init();

    })

}

// view all employees
const viewAllEmployees = () => {
    const query = `
      SELECT
        employee.id AS id,
        employee.first_name,
        employee.last_name,
        role.title AS job_title,
        department.name AS department,
        role.salary,
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
      FROM
        employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id;
    `;
  
    db.query(query, (err, res) => {
      if (err) throw err;
      console.table(res);
      init();
    });
  };
  
// adds a new department into the department table
const addDepartment = () => {
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "Please Type in a new Department name"

    }]).then(res => {
        let userInput = res.department
        db.query("INSERT INTO department (name) Values (?)", [userInput])
        console.log(`New Department Recognized Name: ${userInput}`)
        init();
    });


}
// adds a new role int the role table
const addRole = () => {
    db.query("SELECT * FROM department", (err, res) => {

        if (err) throw err;
        const departments = res.map((department) => ({ name: department.name, value: department.id }));
        

        inquirer.prompt([{

            name: "title",
            type: "input",
            message: "Please Type in a new Role Name",
        },
        {
            name: "salary",
            type: "input",
            message: "Please Type in a new Role Salary",
        },
        {
            name: "department",
            type: "list",
            message: "Which department would you like to add into?",
            choices: departments,
        },
        ]).then(res => {
            if (err) throw err;
            let newRole = res.title
          
            let newSalary = res.salary
        
            let newDept = res.department
        
            db.query("INSERT INTO role (title, salary, department_id) Values (?,?,?)", [newRole, newSalary, newDept])
            if (err) throw err;
            console.log(`New Role has been Added name: ${newRole}`)
            init();
        })

    })
}

// adds a new employee into the employee table
const addEmployee = () => {
    db.query(
      "SELECT emp.*, role.title AS role_name, manager.first_name AS manager_name FROM employee AS emp LEFT JOIN role ON emp.role_id = role.id LEFT JOIN employee AS manager ON emp.manager_id = manager.id",
      (err, res) => {
        if (err) throw err;
  
        const manager = res.map((manage) => ({
          name: manage.first_name + " " + manage.last_name,
          value: manage.id,
        }));
  
        db.query("SELECT * FROM role", (err, roleRes) => {
          const employeeRoles = roleRes.map((role) => ({
            name: role.title,
            value: role.id,
          }));
  
          inquirer
            .prompt([
              {
                name: "first_name",
                type: "input",
                message: "What is the employee's first name?",
              },
              {
                name: "last_name",
                type: "input",
                message: "What is the employee's last name?",
              },
              {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: employeeRoles,
              },
              {
                name: "manager",
                type: "list",
                message: "Who is the employee's manager?",
                choices: manager,
              },
            ])
            .then((res) => {
              if (err) throw err;
              let first = res.first_name;
              let last = res.last_name;
              let role = res.role;
              let nManager = res.manager;
              db.query(
                "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
                [first, last, role, nManager],
                (err, insertRes) => {
                  if (err) throw err;
                  console.log("Employee added successfully!");
                  init();
                }
              );
            });
        });
      }
    );
  };
  
  


// updates employee role
const updateEmployee = () => {
    db.query("SELECT * FROM employee", (err, res) => {

        if (err) throw err;
        const employees = res.map((employee => ({ name: employee.first_name + " " + employee.last_name, value: employee.id })))

       

        db.query("SELECT * FROM role", (err, res) => {



            const roles = res.map((role => ({ name: role.title, value: role.id })));
        



            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee do you want to update?",
                    choices: employees
                },
                {
                    name: "role",
                    type: "list",
                    message: "Which role do you want to assign to the selected employee?",
                    choices: roles
                }
            ]).then((res) => {

                const updateEmployee = res.employee;

                const updateRole = res.role;

                

                db.query(`UPDATE employee SET role_id= ? WHERE id = ?;`, [updateRole, updateEmployee], (err) => {
                    if (err) throw err;
                    console.log("------(Employee role has been updated)-----");
                    init();
                });
            });
        });
    });

}



init();