#!/usr/bin/env node

import { execSync } from 'child_process';
import chalk from 'chalk';
import ora from 'ora';
import figlet from 'figlet';
import boxen from 'boxen';
import gradient from 'gradient-string';

console.log('\n');
console.log(gradient.rainbow(figlet.textSync('Vue-DC', { horizontalLayout: 'full' })));
console.log('\n');

const spinner = ora('正在初始化Git仓库...').start();

try {
  // 检查是否已经初始化Git
  try {
    execSync('git status', { stdio: 'ignore' });
    spinner.succeed('Git仓库已存在');
  } catch (error) {
    // 初始化Git仓库
    execSync('git init', { stdio: 'ignore' });
    spinner.succeed('Git仓库初始化完成');
  }

  // 添加所有文件
  spinner.text = '正在添加文件到暂存区...';
  execSync('git add .', { stdio: 'ignore' });
  spinner.succeed('文件已添加到暂存区');

  // 检查是否有未提交的更改
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      // 创建初始提交
      spinner.text = '正在创建初始提交...';
      execSync('git commit -m "feat: 初始提交 - Vue3动态组件库"', { stdio: 'ignore' });
      spinner.succeed('初始提交创建完成');
    } else {
      spinner.succeed('没有需要提交的更改');
    }
  } catch (error) {
    spinner.fail('提交失败');
    console.error(chalk.red('错误:'), error.message);
    process.exit(1);
  }

  // 显示成功信息
  console.log('\n');
  console.log(boxen(
    chalk.green('🎉 Git仓库初始化成功！\n\n') +
    chalk.cyan('下一步操作：\n') +
    chalk.white('1. 在GitHub上创建仓库\n') +
    chalk.white('2. 运行 npm run push 推送到GitHub\n') +
    chalk.white('3. 运行 npm run dev 启动演示项目\n\n') +
    chalk.yellow('GitHub仓库地址：https://github.com/YuluoY/vue-dc'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));

} catch (error) {
  spinner.fail('Git初始化失败');
  console.error(chalk.red('错误:'), error.message);
  process.exit(1);
}
