/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package snakegame;

import java.awt.*;
import java.util.ArrayList;
import java.util.Random;
/**
 *
 * @author havib
 */

public class Snake {
    private ArrayList<Point> body;
    private String direction;

    public Snake(int startX, int startY) {
        body = new ArrayList<>();
        body.add(new Point(startX, startY)); // Head
        body.add(new Point(startX - SnakeGame.TILE_SIZE, startY)); // Tail
        String[] directions = {"UP", "DOWN", "LEFT", "RIGHT"};
        Random rand = new Random();
        direction = directions[rand.nextInt(directions.length)];
    }

    public void setDirection(String newDirection) {
        if ((direction.equals("UP") && !newDirection.equals("DOWN")) ||
            (direction.equals("DOWN") && !newDirection.equals("UP")) ||
            (direction.equals("LEFT") && !newDirection.equals("RIGHT")) ||
            (direction.equals("RIGHT") && !newDirection.equals("LEFT"))) {
            direction = newDirection;
        }
    }

    public void move() {
        Point head = getHead();
        Point newHead = switch (direction) {
            case "UP" -> new Point(head.x, head.y - SnakeGame.TILE_SIZE);
            case "DOWN" -> new Point(head.x, head.y + SnakeGame.TILE_SIZE);
            case "LEFT" -> new Point(head.x - SnakeGame.TILE_SIZE, head.y);
            case "RIGHT" -> new Point(head.x + SnakeGame.TILE_SIZE, head.y);
            default -> head;
        };

        body.add(0, newHead); // Add the new head
        body.remove(body.size() - 1); // Remove the tail
    }

    public void grow() {
        body.add(new Point(body.get(body.size() - 1)));
    }

    public Point getHead() {
        return body.get(0);
    }

    public boolean checkSelfCollision() {
        Point head = getHead();
        for (int i = 1; i < body.size(); i++) {
            if (head.equals(body.get(i))) {
                return true;
            }
        }
        return false;
    }

    public boolean checkWallCollision(int gridWidth, int gridHeight) {
        Point head = getHead();
        return head.x < 0 || head.y < 0 || head.x >= gridWidth * SnakeGame.TILE_SIZE || head.y >= gridHeight * SnakeGame.TILE_SIZE;
    }

    public boolean containsPoint(Point point) {
        for (Point p : body) {
        if (p.equals(point)) {
            return true;  // If the point matches any point in the snake's body
            }
        }
        return false;  // The point is not part of the snake's body
    }

    public int getLength() {
        return body.size();
    }
    
    public ArrayList<Point> getBody() {
        return body;
    }

    public void draw(Graphics g) {
        g.setColor(Color.GREEN);
        for (Point p : body) {
            g.fillRect(p.x, p.y, SnakeGame.TILE_SIZE, SnakeGame.TILE_SIZE);
        }
    }
}

