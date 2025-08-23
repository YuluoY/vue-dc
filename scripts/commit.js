#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import semver from 'semver';
import fs from 'fs';

const spinner = ora();

// 自动更新CHANGELOG.md
function updateChangelog(version, commitMessage) {
  try {
    const changelogPath = 'CHANGELOG.md';
    let changelog = fs.readFileSync(changelogPath, 'utf8');
    
    // 获取当前日期
    const today = new Date().toISOString().split('T')[0];
    
    // 分析提交信息，尝试确定类型
    const message = commitMessage.toLowerCase();
    let changeType = '变更';
    
    if (message.includes('fix') || message.includes('修复') || message.includes('bug')) {
      changeType = '修复';
    } else if (message.includes('feat') || message.includes('新增') || message.includes('添加')) {
      changeType = '新增';
    } else if (message.includes('docs') || message.includes('文档')) {
      changeType = '文档';
    } else if (message.includes('style') || message.includes('样式')) {
      changeType = '样式';
    } else if (message.includes('refactor') || message.includes('重构')) {
      changeType = '重构';
    } else if (message.includes('test') || message.includes('测试')) {
      changeType = '测试';
    } else if (message.includes('chore') || message.includes('构建')) {
      changeType = '构建';
    }
    
    if (version === '未发布') {
      // 更新"未发布"部分
      const unreleasedPattern = /## \[未发布\][\s\S]*?(?=## \[|$)/;
      const unreleasedMatch = changelog.match(unreleasedPattern);
      
      if (unreleasedMatch) {
        const unreleasedSection = unreleasedMatch[0];
        // 检查是否已经有对应的类型部分
        const typePattern = new RegExp(`### ${changeType}\\s*\\n`, 'g');
        if (typePattern.test(unreleasedSection)) {
          // 在现有类型部分添加新条目
          const newUnreleasedSection = unreleasedSection.replace(
            new RegExp(`(### ${changeType}\\s*\\n)`, 'g'),
            `$1- ${commitMessage}\n`
          );
          changelog = changelog.replace(unreleasedPattern, newUnreleasedSection);
        } else {
          // 在"变更"部分添加
          const newUnreleasedSection = unreleasedSection.replace(
            /### 变更\s*\n/,
            `### 变更\n- ${commitMessage}\n`
          );
          changelog = changelog.replace(unreleasedPattern, newUnreleasedSection);
        }
      } else {
        // 如果没有"未发布"部分，创建一个
        const newUnreleasedSection = `## [未发布]

### 新增
- 无

### 变更
- ${commitMessage}

### 修复
- 无

`;
        changelog = newUnreleasedSection + changelog;
      }
    } else {
      // 创建新的版本条目
      const newEntry = `## [${version}] - ${today}

### 新增
- 无

### 变更
- ${commitMessage}

### 修复
- 无

`;
      
      // 在"未发布"部分之前插入新版本
      const unreleasedIndex = changelog.indexOf('## [未发布]');
      if (unreleasedIndex !== -1) {
        changelog = changelog.slice(0, unreleasedIndex) + newEntry + changelog.slice(unreleasedIndex);
      } else {
        // 如果没有"未发布"部分，在开头添加
        changelog = newEntry + changelog;
      }
    }
    
    fs.writeFileSync(changelogPath, changelog);
    return true;
  } catch (error) {
    console.error('更新CHANGELOG.md失败:', error.message);
    return false;
  }
}

// 生成简单的更新日志
function generateSimpleChangelog(version, commitMessage) {
  try {
    spinner.start('生成更新日志...');
    
    // 读取现有的CHANGELOG.md
    let existingChangelog = '';
    if (fs.existsSync('CHANGELOG.md')) {
      existingChangelog = fs.readFileSync('CHANGELOG.md', 'utf8');
    }
    
    // 创建新的更新日志条目
    const date = new Date().toISOString().split('T')[0];
    const newEntry = `## [${version}] - ${date}\n\n- ${commitMessage}\n\n`;
    
    // 在开头添加新条目
    const newChangelog = newEntry + existingChangelog;
    fs.writeFileSync('CHANGELOG.md', newChangelog);
    
    spinner.succeed('更新日志生成完成');
    return true;
  } catch (error) {
    spinner.warn('更新日志生成失败');
    return false;
  }
}

async function main() {
  try {
    console.log(chalk.cyan('🚀 Vue-DC 自动化提交工具\n'));

    // 检查Git状态
    spinner.start('检查Git状态...');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (!gitStatus.trim()) {
      spinner.fail('没有需要提交的更改');
      process.exit(0);
    }
    spinner.succeed('发现需要提交的更改');

    // 显示更改的文件
    console.log(chalk.blue('\n更改的文件:'));
    const files = gitStatus.trim().split('\n').map(line => line.substring(3));
    files.forEach(file => console.log(chalk.white(`  ${file}`)));

    // 获取提交信息
    const { commitMessage } = await inquirer.prompt([
      {
        type: 'input',
        name: 'commitMessage',
        message: '请输入提交信息:',
        default: '更新代码',
        validate: (input) => {
          if (!input.trim()) {
            return '提交信息不能为空';
          }
          return true;
        }
      }
    ]);
    
    // 显示提交信息格式建议
    console.log(chalk.blue('\n💡 提交信息格式建议:'));
    console.log(chalk.white('  • feat: 新功能 (例如: feat: 添加用户管理功能)'));
    console.log(chalk.white('  • fix: 修复bug (例如: fix: 修复登录验证问题)'));
    console.log(chalk.white('  • docs: 文档更新 (例如: docs: 更新README文档)'));
    console.log(chalk.white('  • style: 代码格式 (例如: style: 格式化代码)'));
    console.log(chalk.white('  • refactor: 重构 (例如: refactor: 重构组件结构)'));
    console.log(chalk.white('  • test: 测试 (例如: test: 添加单元测试)'));
    console.log(chalk.white('  • chore: 构建 (例如: chore: 更新构建配置)'));

    // 询问是否需要更新版本
    const { needVersion } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'needVersion',
        message: '是否需要更新版本号?',
        default: true
      }
    ]);

    let newVersion = null;
    if (needVersion) {
      // 读取当前版本
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const currentVersion = packageJson.version;
      console.log(chalk.blue(`当前版本: ${currentVersion}`));

      // 计算新版本号用于显示
      const patchVersion = semver.inc(currentVersion, 'patch');
      const minorVersion = semver.inc(currentVersion, 'minor');
      const majorVersion = semver.inc(currentVersion, 'major');
      
      // 选择版本类型
      const { versionType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'versionType',
          message: '选择版本类型:',
          choices: [
            { name: `补丁版本 (${currentVersion} -> ${patchVersion}) - Bug修复`, value: 'patch' },
            { name: `小版本 (${currentVersion} -> ${minorVersion}) - 新功能`, value: 'minor' },
            { name: `大版本 (${currentVersion} -> ${majorVersion}) - 重大更新`, value: 'major' },
            { name: '自定义版本', value: 'custom' }
          ]
        }
      ]);

      if (versionType === 'custom') {
        const { customVersion } = await inquirer.prompt([
          {
            type: 'input',
            name: 'customVersion',
            message: '输入新版本号:',
            validate: (input) => {
              if (!semver.valid(input)) {
                return '请输入有效的语义化版本号 (例如: 1.0.0)';
              }
              return true;
            }
          }
        ]);
        newVersion = customVersion;
      } else {
        newVersion = semver.inc(currentVersion, versionType);
      }

      console.log(chalk.yellow(`新版本: ${newVersion}`));
    }

    // 询问是否需要创建标签（可选）
    const { needTag } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'needTag',
        message: '是否需要创建Git标签? (可选)',
        default: true
      }
    ]);

    // 添加文件到暂存区
    spinner.start('添加文件到暂存区...');
    execSync('git add .', { stdio: 'pipe' });
    spinner.succeed('文件已添加到暂存区');

    // 更新版本号（如果需要）
    if (needVersion && newVersion) {
      spinner.start('更新版本号...');
      execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'pipe' });
      
      // 确保package-lock.json也被添加到暂存区
      execSync('git add package.json package-lock.json', { stdio: 'pipe' });
      spinner.succeed(`版本更新为 ${newVersion}`);
      
      // 自动更新CHANGELOG.md
      const changelogUpdated = generateSimpleChangelog(newVersion, commitMessage) || updateChangelog(newVersion, commitMessage);
      if (changelogUpdated) {
        execSync('git add CHANGELOG.md', { stdio: 'pipe' });
        spinner.succeed('CHANGELOG.md 已更新');
      }
    } else {
      // 如果没有更新版本，也尝试更新CHANGELOG.md（用于未发布版本）
      const changelogUpdated = updateChangelog('未发布', commitMessage);
      if (changelogUpdated) {
        execSync('git add CHANGELOG.md', { stdio: 'pipe' });
        spinner.succeed('CHANGELOG.md 已更新');
      }
    }

    // 创建提交
    spinner.start('创建提交...');
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'pipe' });
    spinner.succeed('提交创建完成');

    // 创建标签（如果需要）
    if (needTag) {
      const tagVersion = newVersion || JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
      const { tagMessage } = await inquirer.prompt([
        {
          type: 'input',
          name: 'tagMessage',
          message: '请输入标签信息 (可选):',
          default: `Release v${tagVersion}`
        }
      ]);

      spinner.start('创建Git标签...');
      execSync(`git tag -a v${tagVersion} -m "${tagMessage}"`, { stdio: 'pipe' });
      spinner.succeed(`标签 v${tagVersion} 创建完成`);
    }

    // 推送到远程仓库
    spinner.start('推送到远程仓库...');
    try {
      execSync('git push origin main', { stdio: 'pipe' });
      if (needTag) {
        execSync('git push origin --tags', { stdio: 'pipe' });
      }
      spinner.succeed('推送到远程仓库成功');
    } catch (error) {
      spinner.warn('推送到远程仓库失败，请手动推送');
      console.log(chalk.yellow('运行以下命令手动推送:'));
      console.log(chalk.white('  git push origin main'));
      if (needTag) {
        console.log(chalk.white('  git push origin --tags'));
      }
    }

    // 成功信息
    console.log('\n' + chalk.green('🎉 提交成功！'));
    console.log('\n' + chalk.cyan('提交摘要:'));
    console.log(chalk.white(`  提交信息: ${commitMessage}`));
    if (needVersion && newVersion) {
      console.log(chalk.white(`  新版本: ${newVersion}`));
    }
    if (needTag) {
      const tagVersion = newVersion || JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
      console.log(chalk.white(`  标签: v${tagVersion}`));
    }

    // 后续建议
    if (needTag) {
      const tagVersion = newVersion || JSON.parse(fs.readFileSync('package.json', 'utf8')).version;
      console.log('\n' + chalk.yellow('后续建议:'));
      console.log(chalk.white(`1. 在GitHub上创建Release: https://github.com/YuluoY/vue-dc/releases/new`));
    }

  } catch (error) {
    spinner.fail('提交过程中发生错误');
    console.error(chalk.red('错误:'), error.message);
    process.exit(1);
  }
}

main();
