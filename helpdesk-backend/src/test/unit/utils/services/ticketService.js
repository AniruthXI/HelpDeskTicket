// tests/unit/services/ticketService.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Ticket = require("../../../models/ticket.model");
const User = require("../../../models/user.model");
const ticketService = require("../../../services/ticket.service");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Ticket.deleteMany({});
  await User.deleteMany({});
});

describe("Ticket Service", () => {
  test("createTicket should create a new ticket", async () => {
    // Create a test user first
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      role: "user",
    });

    const ticketData = {
      title: "Test Ticket",
      description: "Test Description",
      priority: "medium",
      category: "general",
    };

    const ticket = await ticketService.createTicket(ticketData, user._id);

    expect(ticket.title).toBe("Test Ticket");
    expect(ticket.status).toBe("pending");
    expect(ticket.createdBy.toString()).toBe(user._id.toString());
  });

  test("getTicketById should return the ticket if it exists", async () => {
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    const createdTicket = await Ticket.create({
      title: "Test Ticket",
      description: "Test Description",
      status: "pending",
      priority: "medium",
      category: "general",
      createdBy: user._id,
    });

    const ticket = await ticketService.getTicketById(createdTicket._id);

    expect(ticket._id.toString()).toBe(createdTicket._id.toString());
    expect(ticket.title).toBe("Test Ticket");
  });

  test("updateTicket should update ticket fields", async () => {
    const user = await User.create({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    const createdTicket = await Ticket.create({
      title: "Original Title",
      description: "Original Description",
      status: "pending",
      priority: "medium",
      category: "general",
      createdBy: user._id,
    });

    const updateData = {
      title: "Updated Title",
      status: "in_progress",
    };

    const updatedTicket = await ticketService.updateTicket(
      createdTicket._id,
      updateData
    );

    expect(updatedTicket.title).toBe("Updated Title");
    expect(updatedTicket.status).toBe("in_progress");
    expect(updatedTicket.description).toBe("Original Description"); // Unchanged fields remain the same
  });
});
