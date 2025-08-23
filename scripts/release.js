#!/usr/bin/env node

import { execSync } from 'child_process';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import semver from 'semver';

const spinner = ora();

async function main() {
  try {
    console.log(chalk.cyan('🚀 Vue-DC 版本发布工具\n'));

    // 检查Git状态
    spinner.start('检查Git状态...');
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim()) {
      spinner.fail('工作目录有未提交的更改，请先提交或暂存');
      console.log(chalk.yellow('运行以下命令查看更改:'));
      console.log(chalk.white('  git status'));
      process.exit(1);
    }
    spinner.succeed('Git状态检查通过');

    // 获取当前版本
    const packageJson = JSON.parse(await import('../package.json', { assert: { type: 'json' } }));
    const currentVersion = packageJson.version;
    console.log(chalk.blue(`当前版本: ${currentVersion}\n`));

    // 选择版本类型
    const { releaseType } = await inquirer.prompt([
      {
        type: 'list',
        name: 'releaseType',
        message: '选择发布类型:',
        choices: [
          { name: '补丁版本 (1.0.0 -> 1.0.1) - Bug修复', value: 'patch' },
          { name: '小版本 (1.0.0 -> 1.1.0) - 新功能', value: 'minor' },
          { name: '大版本 (1.0.0 -> 2.0.0) - 重大更新', value: 'major' },
          { name: '预发布版本 (1.0.0 -> 1.0.1-beta.0)', value: 'prerelease' },
          { name: '自定义版本', value: 'custom' }
        ]
      }
    ]);

    let newVersion;
    if (releaseType === 'custom') {
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
      newVersion = semver.inc(currentVersion, releaseType);
    }

    console.log(chalk.yellow(`新版本: ${newVersion}\n`));

    // 确认发布
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `确认发布版本 ${newVersion} 吗?`,
        default: false
      }
    ]);

    if (!confirm) {
      console.log(chalk.red('发布已取消'));
      process.exit(0);
    }

    // 运行测试
    spinner.start('运行测试...');
    try {
      execSync('npm test', { stdio: 'pipe' });
      spinner.succeed('测试通过');
    } catch (error) {
      spinner.fail('测试失败');
      console.error(chalk.red('请修复测试错误后重新发布'));
      process.exit(1);
    }

    // 运行代码检查
    spinner.start('运行代码检查...');
    try {
      execSync('npm run lint', { stdio: 'pipe' });
      spinner.succeed('代码检查通过');
    } catch (error) {
      spinner.fail('代码检查失败');
      console.error(chalk.red('请修复代码问题后重新发布'));
      process.exit(1);
    }

    // 更新版本号
    spinner.start('更新版本号...');
    execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'pipe' });
    spinner.succeed(`版本更新为 ${newVersion}`);

    // 创建Git标签和提交
    spinner.start('创建Git标签和提交...');
    execSync('git add package.json', { stdio: 'pipe' });
    execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'pipe' });
    execSync(`git tag v${newVersion}`, { stdio: 'pipe' });
    spinner.succeed('Git标签和提交创建完成');

    // 推送更改
    spinner.start('推送到远程仓库...');
    try {
      execSync('git push origin main', { stdio: 'pipe' });
      execSync('git push origin --tags', { stdio: 'pipe' });
      spinner.succeed('推送到远程仓库成功');
    } catch (error) {
      spinner.warn('推送到远程仓库失败，请手动推送');
      console.log(chalk.yellow('运行以下命令手动推送:'));
      console.log(chalk.white('  git push origin main'));
      console.log(chalk.white('  git push origin --tags'));
    }

    // 成功信息
    console.log('\n' + chalk.green('🎉 正式版本发布成功！'));
    console.log('\n' + chalk.cyan('发布摘要:'));
    console.log(chalk.white(`  版本: ${newVersion}`));
    console.log(chalk.white(`  标签: v${newVersion}`));
    console.log(chalk.white(`  GitHub: https://github.com/YuluoY/vue-dc/releases/tag/v${newVersion}`));

    // 后续建议
    console.log('\n' + chalk.yellow('后续建议:'));
    console.log(chalk.white('1. 在GitHub上创建Release'));
    console.log(chalk.white('2. 更新CHANGELOG.md'));
    console.log(chalk.white('3. 发布到npm (如果需要): npm publish'));
    console.log(chalk.white('4. 通知团队成员新版本发布'));

  } catch (error) {
    spinner.fail('发布过程中发生错误');
    console.error(chalk.red('错误:'), error.message);
    process.exit(1);
  }
}

main();
