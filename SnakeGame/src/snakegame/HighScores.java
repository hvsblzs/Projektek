package snakegame;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;

/**
 *
 * @author havib
 */
public class HighScores {

    int maxScores;
    PreparedStatement insertStatement;
    PreparedStatement deleteStatement;
    Connection connection;

    public HighScores(int maxScores) throws SQLException {
        this.maxScores = maxScores;
        String dbURL = "jdbc:derby://localhost:1527/scoreboard";
        connection = DriverManager.getConnection(dbURL);
        String insertQuery = "INSERT INTO SCOREBOARD (SCORE, NAME, TIME) VALUES (?, ?, ?)";
        insertStatement = connection.prepareStatement(insertQuery);
        String deleteQuery = "DELETE FROM SCOREBOARD WHERE SCORE=?";
        deleteStatement = connection.prepareStatement(deleteQuery);
    }
    
    public ArrayList<HighScore> getHighScores() throws SQLException {
        String querySQL = "SELECT * FROM SCOREBOARD ORDER BY SCORE DESC FETCH FIRST 10 ROWS ONLY";
        ArrayList<HighScore> highScores = new ArrayList<>();
        try (PreparedStatement preparedStatement = connection.prepareStatement(querySQL)) {
            ResultSet resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                String name = resultSet.getString("NAME");
                int score = resultSet.getInt("SCORE");
                Timestamp time = resultSet.getTimestamp("TIME");

                System.out.println("Retrieved: " + name + " - " + score); // Debugging
                highScores.add(new HighScore(name, score));
            }
        }
        System.out.println("Total scores retrieved: " + highScores.size());
        return highScores;
    }

    public void saveHighScore(String name, int score) throws SQLException {
        String insertSQL = "INSERT INTO SCOREBOARD (SCORE, NAME, TIME) VALUES (?, ?, ?)";
        try (PreparedStatement preparedStatement = connection.prepareStatement(insertSQL)) {
            preparedStatement.setInt(1, score);
            preparedStatement.setString(2, name);
            preparedStatement.setTimestamp(3, new Timestamp(System.currentTimeMillis()));
            int rows = preparedStatement.executeUpdate();
            System.out.println("Inserted " + rows + " row(s): " + name + " - " + score); // Debugging
        }
    }
}
