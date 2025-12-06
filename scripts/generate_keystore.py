#!/usr/bin/env python3
"""
Android 签名密钥生成脚本
生成 Release 签名所需的 keystore 文件和配置

使用方法:
    python scripts/generate_keystore.py

生成内容:
    - android/app/release.keystore  签名密钥文件
    - android/keystore.properties   签名配置文件（不要提交到 Git）
"""

import os
import subprocess
import sys
import secrets
import string
from pathlib import Path


def get_project_root() -> Path:
    """获取项目根目录"""
    return Path(__file__).parent.parent


def generate_password(length: int = 16) -> str:
    """生成随机密码"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def check_keytool():
    """检查 keytool 是否可用"""
    try:
        subprocess.run(['keytool', '-help'], capture_output=True)
        return True
    except FileNotFoundError:
        return False


def generate_keystore():
    """生成签名密钥"""
    project_root = get_project_root()
    android_dir = project_root / 'android'
    app_dir = android_dir / 'app'

    keystore_path = app_dir / 'release.keystore'
    config_path = android_dir / 'keystore.properties'

    # 检查是否已存在
    if keystore_path.exists():
        print(f'⚠️  签名文件已存在: {keystore_path}')
        response = input('是否覆盖？(y/N): ').strip().lower()
        if response != 'y':
            print('已取消')
            return False
        keystore_path.unlink()

    # 检查 keytool
    if not check_keytool():
        print('❌ keytool 未找到，请确保已安装 JDK')
        print('   macOS: brew install openjdk')
        print('   或设置 JAVA_HOME 环境变量')
        return False

    # 生成密码
    store_password = generate_password()
    key_password = generate_password()
    key_alias = 'release-key'

    print('🔐 生成 Release 签名密钥...\n')

    # 收集证书信息
    print('请输入证书信息（直接回车使用默认值）:\n')

    cn = input('  姓名 [Developer]: ').strip() or 'Developer'
    ou = input('  组织单位 [Development]: ').strip() or 'Development'
    o = input('  组织名称 [MyCompany]: ').strip() or 'MyCompany'
    l = input('  城市 [Beijing]: ').strip() or 'Beijing'
    st = input('  省份 [Beijing]: ').strip() or 'Beijing'
    c = input('  国家代码 [CN]: ').strip() or 'CN'

    dname = f'CN={cn}, OU={ou}, O={o}, L={l}, ST={st}, C={c}'

    print(f'\n📝 证书信息: {dname}\n')

    # 生成 keystore
    cmd = [
        'keytool', '-genkeypair',
        '-v',
        '-storetype', 'PKCS12',
        '-keystore', str(keystore_path),
        '-alias', key_alias,
        '-keyalg', 'RSA',
        '-keysize', '2048',
        '-validity', '10000',
        '-storepass', store_password,
        '-keypass', key_password,
        '-dname', dname,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f'❌ 生成失败: {result.stderr}')
        return False

    print(f'✅ 签名文件已生成: {keystore_path}\n')

    # 生成配置文件
    config_content = f"""# Android Release 签名配置
# ⚠️ 此文件包含敏感信息，请勿提交到 Git

storeFile=release.keystore
storePassword={store_password}
keyAlias={key_alias}
keyPassword={key_password}
"""

    config_path.write_text(config_content)
    print(f'✅ 配置文件已生成: {config_path}\n')

    # 更新 .gitignore
    update_gitignore(project_root)

    # 打印信息
    print('=' * 50)
    print('🎉 签名配置完成!')
    print('=' * 50)
    print(f'\n📁 文件位置:')
    print(f'   签名文件: android/app/release.keystore')
    print(f'   配置文件: android/keystore.properties')
    print(f'\n🔑 签名信息:')
    print(f'   Key Alias: {key_alias}')
    print(f'   Store Password: {store_password}')
    print(f'   Key Password: {key_password}')
    print(f'\n⚠️  重要提示:')
    print(f'   1. 请妥善保管以上密码，丢失后无法恢复')
    print(f'   2. keystore.properties 已添加到 .gitignore')
    print(f'   3. 建议将密码保存到安全的密码管理器中')

    return True


def update_gitignore(project_root: Path):
    """更新 .gitignore"""
    gitignore_path = project_root / '.gitignore'

    entries_to_add = [
        '# Android 签名文件',
        'android/app/release.keystore',
        'android/keystore.properties',
    ]

    existing_content = ''
    if gitignore_path.exists():
        existing_content = gitignore_path.read_text()

    # 检查是否已添加
    if 'keystore.properties' in existing_content:
        return

    # 添加到 .gitignore
    with open(gitignore_path, 'a') as f:
        f.write('\n' + '\n'.join(entries_to_add) + '\n')

    print('✅ 已更新 .gitignore\n')


def main():
    print('=' * 50)
    print('🔐 Android Release 签名生成工具')
    print('=' * 50 + '\n')

    generate_keystore()


if __name__ == '__main__':
    main()
