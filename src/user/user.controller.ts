import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * 
   * @returns { total: number; items: User[] }
   * @description URL: /api/user
      Method: GET
      Description: This method list all users
      Request parameters: none
      Detail: The result is a json result with a list of all users.
      Response: total: total amount of users in database.
      Items: List of users. Each item in the list should include the following information: id, name, username,
      password, created, updated
   */
  @Get()
  async findAll(): Promise<{ total: number; items: User[] }> {
    const users = await this.userService.findAll();
    return {
      total: users.length,
      items: users,
    };
  }

  /**
   * 
   * @param id 
   * @returns {name: string; username: string; password: string; created: Date; updated: Date}
   * @description URL: /api/user/:id
      Method: GET
      Description: Access the detail of a specific user.
      Request parameters: id
      Detail: The result is a json result with one user with the id specified in the url.
      Response: Includes the following information: id, name, username, password, created, updated
   */
  @Get(':id')
  findOne(@Param('id') id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }


  /**
   *    
   * @param data 
   * @returns { id: number; name: string; username: string; password: string; created: Date; updated: Date }
   * @description URL: /api/user
      Method: POST
      Description: Create a new user
      Request parameters: name, username, password (plain text)
      Detail: This method creates a new element in the database with the received parameters.
      Password: Should be codified before stored in the database.
      Created: use current timestamp
      Updated: use current timestamp
      Response: Includes the following information from the created element: id, name, username, password, created, updated 
   */
  @Post()
  create(@Body() data: Partial<User>): Promise<User | Error> {
    return this.userService.create(data);
  }

  /**
   * 
   * @param id 
   * @param data 
   * @returns { id: number; name: string; username: string; password: string; created: Date; updated: Date }
   * @description URL: /api/user/:id
   * Method: PUT
      Description: Edit a new user
      Request parameters: id, name, username, password (plain text)
      Detail: This method edits a new element in the database with the received parameters.
      Id: element to edit
      Password: Should be codified before stored in the database.
      Created: use current timestamp
      Updated: use current timestamp
      Response: Includes the following information from the edited element: id, name, username, password, created, updated
   */
  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<User>) {
    return this.userService.update(id, data);
  }


  /**
   * 
   * @param body 
   * @returns 
   * @description URL: /api/user/authenticate
      Method: POST
      Description: Login user
      Request parameters: username, password (plain text)
      Detail: This method verifies that username is stored in the database and the password is correct.
      Response: Json that includes key: authorised which will be true or false according to the result.
   */
  @Post('authenticate')
  async authenticate(@Body() body: { username: string; password: string }) {
    return this.userService.authenticate(body.username, body.password);
  }
}
