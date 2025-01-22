/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package snakegame;

import java.awt.BorderLayout;
import java.awt.Font;
import java.util.ArrayList;
import javax.swing.*;
import java.sql.SQLException;
/**
 *
 * @author havib
 */
public class SnakeGameGUI {
    private JFrame frame;
    
    public SnakeGameGUI() {
        frame = new JFrame("Snake Game");
        
        SnakeGame game = new SnakeGame();
        
        game.setGameOverListener(score -> showGameOverPanel(score));
        frame.add(game);
        
        initializeOptionPanels(frame);

        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);

        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }

    private void initializeOptionPanels(JFrame frame) {
        JMenuBar menuBar = new JMenuBar();
        JMenu menu = new JMenu("Options");

        JMenuItem quitItem = new JMenuItem("Quit");
        quitItem.addActionListener(e -> System.exit(0));
        
        JMenuItem restartItem = new JMenuItem("Restart");
        restartItem.addActionListener(e -> startNewGame());
        
        JMenuItem scoreboardItem = new JMenuItem("Scoreboard");
        scoreboardItem.addActionListener(e -> showScoreboard());
        
        menu.add(restartItem);
        menu.add(scoreboardItem);
        menu.add(quitItem);
        menuBar.add(menu);

        frame.setJMenuBar(menuBar);
    }
    
    private void startNewGame(){
        frame.dispose();
        SnakeGameGUI gui = new SnakeGameGUI();
    }
    
    private void showGameOverPanel(int score) {
        JPanel panel = new JPanel(new BorderLayout());
        JLabel label = new JLabel("Game Over! Your score: " + score, SwingConstants.CENTER);
        label.setFont(new Font("Arial", Font.BOLD, 16));

        JTextField nameField = new JTextField(10);
        JButton submitButton = new JButton("Submit");
        submitButton.addActionListener(e -> {
            String playerName = nameField.getText();
            try{
                HighScores scoreboard = new HighScores(10);
                scoreboard.saveHighScore(playerName, score);
            }
            catch(SQLException ex){
                JOptionPane.showMessageDialog(frame, "Failed to load scoreboard: " + ex.getMessage(),
                                          "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        panel.add(label, BorderLayout.NORTH);
        JPanel inputPanel = new JPanel();
        inputPanel.add(new JLabel("Enter your name: "));
        inputPanel.add(nameField);
        inputPanel.add(submitButton);
        panel.add(inputPanel, BorderLayout.CENTER);

        JOptionPane.showMessageDialog(frame, panel, "Game Over", JOptionPane.PLAIN_MESSAGE);
    }
    
    private void showScoreboard() {
        try {
            HighScores scoreboard = new HighScores(10);
            ArrayList<HighScore> scores = scoreboard.getHighScores();

            StringBuilder message = new StringBuilder("Top 10 Players:\n\n");
            for (int i = 0; i < scores.size(); i++) {
                HighScore score = scores.get(i);
                message.append(i + 1).append(". ").append(scores.get(i).getName())
                       .append(" - ").append(scores.get(i).getScore()).append("\n");
            }

            JOptionPane.showMessageDialog(frame, message.toString(), "Scoreboard",
                                          JOptionPane.INFORMATION_MESSAGE);
        } catch (SQLException ex) {
            JOptionPane.showMessageDialog(frame, "Failed to load scoreboard: " + ex.getMessage(),
                                          "Database Error", JOptionPane.ERROR_MESSAGE);
        }
    }
}
